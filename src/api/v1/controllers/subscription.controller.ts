import { Router, Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';

import { RedisService } from '../services/redis.service';
import { SubscriptionService } from '../services/subscription.service';
import { TiersService } from '../services/tiers.service';
import { findAuthDataByToken } from '../../../utils/findAuthDataByToken';
import { checkIfBotHasAdministrator, checkIfUserHasAdministrator } from '../DiscordAPI';
import { StripeAuthService } from '../services/stripe-auth.service';
import { calculateNextPaymentDate, checkIfAnyElementInObjectIsEmpty, nowDate } from '../../../utils';
import { Tier } from '../interfaces/types/tier';
import { setMultipleRolesForUser } from '../DiscordAPI/setMultipleRolesForUser';
import { PremiumSubscriptionService } from '../services/premium-subscription.service';
import { PaymentHistory } from '../services/payment-history.service';

@autoInjectable()
export class SubscriptionController {
	router: Router;
	RedisService: RedisService;
	SubscriptionService: SubscriptionService;
	TiersService: TiersService;
	StripeAuthService: StripeAuthService;
	PaymentHistory: PaymentHistory;
	PremiumSubscriptionService: PremiumSubscriptionService;

	constructor(
		RedisService: RedisService,
		SubscriptionService: SubscriptionService,
		TiersService: TiersService,
		StripeAuthService: StripeAuthService,
		PremiumSubscriptionService: PremiumSubscriptionService,
		PaymentHistory: PaymentHistory,
	) {
		this.router = Router();
		this.RedisService = RedisService;
		this.SubscriptionService = SubscriptionService;
		this.TiersService = TiersService;
		this.PaymentHistory = PaymentHistory;
		this.StripeAuthService = StripeAuthService;
		this.PremiumSubscriptionService = PremiumSubscriptionService;
	}

	async redirectUserToPaymentLink(request: Request, response: Response) {
		const requestedData = {
			guild_id: request.params.guildId,
			encrypted_token: request.headers.authorization,
			tier_id: request.body.tier_id,
		};
		const tier = await this.TiersService.getTierById(requestedData.tier_id, requestedData.guild_id);
		if (!tier || tier.length === 0 || tier.length > 1)
			return response.status(404).send({ msg: 'The tier is not found' });
		const auth_data = await findAuthDataByToken(requestedData.encrypted_token);
		const discord_user_id = auth_data.discord_user_id;

		const checkIfUserInGuild = await checkIfUserHasAdministrator(tier[0].guild_id, discord_user_id);
		if (!checkIfUserInGuild)
			return response.status(404).send({ msg: 'The user that want to subscribe is not found in the guild' });

		const checkIfBotHasPerm = await checkIfBotHasAdministrator(tier[0].guild_id);
		if (!checkIfBotHasPerm)
			return response.status(400).send({
				msg: `the bot doesn't have ADMINISTRATOR permission in the server, please contact the discord server owner`,
			});

		if (tier[0].premium_discord_roles.length === 0)
			return response.status(400).send({ msg: 'there is no roles provided in the tier' });

		const returnCode = this.SubscriptionService.createReturnUrlCode();
		await this.RedisService.setJsonData(returnCode, { tier: tier[0], discord_user_id }, 60 * 60 * 25);
		const stripeAuthData = await this.StripeAuthService.getStripeAuthDataFromGuildId(tier[0].guild_id);
		const checkIfGuildPremium = await this.PremiumSubscriptionService.isGuildPremium(tier[0].guild_id);

		await this.PaymentHistory.SaveToPaymentHistory({
			completed: false,
			discord_user_id,
			guild_id: requestedData.guild_id,
			paymentMethod: 'stripe',
			returnCode,
			type: 'subscription',
		});

		const stripeCheckout = await this.SubscriptionService.createPaymentLinkForTier(
			{
				name: tier[0].name,
				price: tier[0].price,
			},
			stripeAuthData.connected_stripe_account_id,
			checkIfGuildPremium,
			`${process.env.STRIPE_CHECKOUT_RETURN_URL}?code=${returnCode}`,
			process.env.STRIPE_CHECKOUT_CANCEL_URL,
		);

		return response.status(200).send(stripeCheckout);
	}

	async successCheckout(request: Request, response: Response) {
		const code = String(request.query.code).replace(' ', '');
		if (!code) return response.status(400).send({ msg: 'your code is not valid' });

		const dataFromCode: { tier: Tier; discord_user_id: string } = await this.RedisService.getJsonData(code);

		const paymentHistoryData = await this.PaymentHistory.getPaymentHistory(code);
		if (!dataFromCode) {
			return response.status(400).send({
				msg: `Something wrong happened while processing your payment, please contact our customer support, please share this payment code with our customer support [${paymentHistoryData.returnCode}]`,
			});
		}

		const subscriptionData = await this.SubscriptionService.saveSubscriptionToDatabase({
			discord_user_id: dataFromCode.discord_user_id,
			guild_id: dataFromCode.tier.guild_id,
			status: 'active',
			tier_id: dataFromCode.tier.id,
			start_date: nowDate,
			end_date: calculateNextPaymentDate(nowDate, 30, 'date'),
		});

		await setMultipleRolesForUser(
			dataFromCode.tier.guild_id,
			dataFromCode.discord_user_id,
			dataFromCode.tier.premium_discord_roles,
		);

		await this.PaymentHistory.completePaymentHistory(code);

		return response.status(200).send(subscriptionData);
	}

	async cancelCheckout(request: Request, response: Response) {
		return response.status(200).send({ msg: 'checkout has been canceled' });
	}

	async getAllSubscriptions(request: Request, response: Response) {
		const requestedData = {
			guild_id: request.params.guildId,
			encryptedToken: request.headers.authorization,
		};
		if (checkIfAnyElementInObjectIsEmpty(requestedData))
			return response.status(400).send({ msg: 'the data you provided is not valid' });
		const auth_data = await findAuthDataByToken(requestedData.encryptedToken);
		const checkPerm = await checkIfUserHasAdministrator(requestedData.guild_id, auth_data.discord_user_id);

		if (!checkPerm) return response.status(400).send({ msg: `You don't have ADMINISTRATOR permission` });

		const subscriptionData = await this.SubscriptionService.getAllSubscriptionsByGuildId(requestedData.guild_id);
		return response.status(200).send(subscriptionData);
	}

	async getSubscription(request: Request, response: Response) {
		const requestedData = {
			guild_id: request.params.guildId,
			encryptedToken: request.headers.authorization,
			subscribed_discord_user_id: request.body.discord_user_id,
		};

		if (checkIfAnyElementInObjectIsEmpty(requestedData))
			return response.status(400).send({ msg: 'the data you provided is not valid' });

		const auth_data = await findAuthDataByToken(requestedData.encryptedToken);
		const checkPerm = await checkIfUserHasAdministrator(requestedData.guild_id, auth_data.discord_user_id);

		if (!checkPerm) return response.status(400).send({ msg: `You don't have ADMINISTRATOR permission` });

		const subscriptionData = await this.SubscriptionService.getSubscriptionByUserAndGuild(
			requestedData.subscribed_discord_user_id,
			requestedData.guild_id,
		);

		return response.status(200).send(subscriptionData);
	}

	routes() {
		this.router.get(
			'/redirect/:guildId',
			async (request: Request, response: Response) => await this.redirectUserToPaymentLink(request, response),
		);

		this.router.get(
			'/getAll/:guildId',
			async (request: Request, response: Response) => await this.getAllSubscriptions(request, response),
		);

		this.router.get(
			'/get/:guildId',
			async (request: Request, response: Response) => await this.getSubscription(request, response),
		);

		this.router.get(
			'/return',
			async (request: Request, response: Response) => await this.successCheckout(request, response),
		);

		this.router.get(
			'/cancel',
			async (request: Request, response: Response) => await this.cancelCheckout(request, response),
		);

		return this.router;
	}
}
