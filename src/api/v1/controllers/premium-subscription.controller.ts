import { Router, Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { PremiumSubscriptionService } from '../services/premium-subscription.service';
import {
	calculateNextPaymentDate,
	checkIfAnyElementInObjectIsEmpty,
	findAuthDataByToken,
	nowDate,
} from '../../../utils';
import { checkIfUserHasAdministrator, checkIfUserIsOwner } from '../DiscordAPI';
import { RedisService } from '../services/redis.service';
import { PaymentHistory } from '../services/payment-history.service';

@autoInjectable()
export class PremiumSubscriptionController {
	router: Router;
	PremiumSubscriptionService: PremiumSubscriptionService;
	RedisService: RedisService;
	PaymentHistory: PaymentHistory;

	constructor(
		PremiumSubscriptionService: PremiumSubscriptionService,
		RedisService: RedisService,
		PaymentHistory: PaymentHistory,
	) {
		this.PremiumSubscriptionService = PremiumSubscriptionService;
		this.RedisService = RedisService;
		this.PaymentHistory = PaymentHistory;
		this.router = Router();
	}

	async subscribeToPremiumPlan(request: Request, response: Response) {
		const requestedData = {
			encrypted_token: request.headers.authorization,
			guild_id: request.body.guild_id,
			period: request.body.period,
		};
		const auth_data = await findAuthDataByToken(requestedData.encrypted_token);
		const discord_user_id = auth_data.discord_user_id;

		const availablePeriods = ['monthly', 'yearly'];
		if (!availablePeriods.includes(requestedData.period) || !requestedData.guild_id || !requestedData.encrypted_token)
			return response.status(400).send({ msg: 'the data you provided is not valid' });

		const checkIfUserIsOwnerInTheGuild = await checkIfUserIsOwner(requestedData.guild_id, discord_user_id);
		if (!checkIfUserIsOwnerInTheGuild)
			return response
				.status(400)
				.send({ msg: 'To subscribe to our premium plan You have to be the owner of the guild' });

		const isGuildPremium = await this.PremiumSubscriptionService.isGuildPremium(requestedData.guild_id);
		if (isGuildPremium) return response.status(400).send({ msg: 'You already subscribed to our plan' });

		const product = await this.PremiumSubscriptionService.createProduct(`Semibot Premium ${requestedData.period}`);

		const productPrice = await this.PremiumSubscriptionService.createPrice(
			product.id,
			requestedData.period === 'yearly'
				? Number(process.env.TIER_PRICE_YEARLY!)
				: Number(process.env.TIER_PRICE_MONTHLY!),
		);

		const returnCode = await this.PremiumSubscriptionService.createReturnUrlCode();
		await this.RedisService.setJsonData(
			returnCode,
			{ guild_id: requestedData.guild_id, period: requestedData.period, discord_user_id },
			60 * 60 * 25,
		);

		await this.PaymentHistory.SaveToPaymentHistory({
			completed: false,
			discord_user_id,
			guild_id: requestedData.guild_id,
			paymentMethod: 'stripe',
			returnCode,
			type: 'premium-subscription',
		});

		const checkoutSession = await this.PremiumSubscriptionService.createCheckoutSession(
			`${process.env.STRIPE_PREMIUM_RETURN_URL}?code=${returnCode}`,
			`${process.env.STRIPE_PREMIUM_CANCEL_URL}`,
			productPrice.id,
		);

		return response.status(200).send(checkoutSession);
	}

	async successCheckout(request: Request, response: Response) {
		const code = String(request.query.code);
		if (!code) return response.status(400).send({ msg: 'your code is not valid' });

		const dataFromCode: { guild_id: string; period: 'monthly' | 'yearly'; discord_user_id: string } =
			await this.RedisService.getJsonData(code);

		const paymentHistoryData = await this.PaymentHistory.getPaymentHistory(code);
		if (!dataFromCode) {
			return response.status(400).send({
				msg: `Something wrong happened while processing your payment, please contact our customer support, please share this payment code with our customer support [${paymentHistoryData.returnCode}]`,
			});
		}
		const premiumData = await this.PremiumSubscriptionService.savePremiumSubscriptionToDatabase({
			discord_user_id: dataFromCode.discord_user_id,
			guild_id: dataFromCode.guild_id,
			end_date: calculateNextPaymentDate(nowDate, dataFromCode.period === 'yearly' ? 366 : 30, 'date'),
			start_date: nowDate,
			status: 'active',
		});

		await this.PaymentHistory.completePaymentHistory(code);

		return response.status(200).send(premiumData);
	}

	async cancelCheckout(request: Request, response: Response) {
		return response.status(200).send({ msg: 'checkout has been canceled' });
	}

	async getPremiumSubscription(request: Request, response: Response) {
		const requestedData = {
			guild_id: request.params.guildId,
			encryptedToken: request.headers.authorization,
		};

		if (checkIfAnyElementInObjectIsEmpty(requestedData))
			return response.status(400).send({ msg: 'the data you provided is not valid' });

		const auth_data = await findAuthDataByToken(requestedData.encryptedToken);
		const checkPerm = await checkIfUserHasAdministrator(requestedData.guild_id, auth_data.discord_user_id);

		if (!checkPerm) return response.status(400).send({ msg: `You don't have ADMINISTRATOR permission` });

		const premiumData = await this.PremiumSubscriptionService.getPremiumSubscriptionByGuildId(requestedData.guild_id);

		return response.status(200).send(premiumData);
	}

	routes() {
		this.router.get('/subscribe', async (request, response) => await this.subscribeToPremiumPlan(request, response));
		this.router.get('/subscribe/return', async (request, response) => await this.successCheckout(request, response));
		this.router.get('/subscribe/cancel', async (request, response) => await this.cancelCheckout(request, response));
		this.router.get('/get/:guildId', async (request, response) => await this.cancelCheckout(request, response));

		return this.router;
	}
}
