import { Router, Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { StripeAuthService } from '../services/stripe-auth.service';
import { RedisService } from '../services/redis.service';
import { findAuthDataByToken } from '../../../utils/findAuthDataByToken';
import { checkIfAnyElementInObjectIsEmpty, checkUserPermission } from '../../../utils';

@autoInjectable()
export class StripeAuthController {
	envData = process.env;
	router: Router;
	StripeAuthService: StripeAuthService;
	RedisService: RedisService;

	constructor(StripeAuthService: StripeAuthService, RedisService: RedisService) {
		this.StripeAuthService = StripeAuthService;
		this.RedisService = RedisService;
		this.router = Router();
	}

	async redirectToStripeAuthLink(request: Request, response: Response) {
		try {
			const requestedData = {
				guild_id: request.body.guild_id,
				encrypted_token: request.headers.authorization,
			};

			if (checkIfAnyElementInObjectIsEmpty(requestedData))
				return response.status(400).send({ msg: 'the data you provided is not valid' });

			const auth_data = await findAuthDataByToken(requestedData.encrypted_token);
			const discord_user_id = auth_data.discord_user_id;
			const checkUserPerm = await checkUserPermission(requestedData.guild_id, discord_user_id);
			if (!checkUserPerm) return response.status(400).send({ msg: `the user doesn't have ADMINISTRATOR permission` });

			const authCode = this.StripeAuthService.createReturnUrlCode();

			const authUrl = await this.StripeAuthService.generateStripeOauthUrl(authCode);
			await this.RedisService.setJsonData(
				authCode,
				{ discord_user_id, guild_id: requestedData.guild_id },
				60 * 60 * 24,
			);

			response.status(200).send({ authUrl: authUrl });
		} catch (error) {
			console.log(error);
			response.send({ msg: 'an error has been occured' });
		}
	}

	async getStripeAccountDataFromSuccessAuth(request: Request, response: Response) {
		try {
			const code = request.query.code as string;
			const auth_code = request.query.state as string;
			const auth_data = (await this.RedisService.getJsonData(auth_code)) as {
				discord_user_id: string;
				guild_id: string;
			};
			if (!auth_data) return response.status(404).send({ msg: 'please re-authorize' });
			const stripeData = await this.StripeAuthService.getStripeDataFromAuthCode(code);
			const data = await this.StripeAuthService.saveStripeAuthData(
				stripeData.stripe_user_id,
				auth_data.discord_user_id,
				auth_data.guild_id,
			);
			response.status(200).send(data);
		} catch (error) {
			console.log(error);
			response.send({ msg: 'an error has been occured' });
		}
	}

	routes() {
		this.router.get(
			'/',
			async (request: Request, response: Response) => await this.redirectToStripeAuthLink(request, response),
		);

		this.router.get(
			'/callback',
			async (request: Request, response: Response) => await this.getStripeAccountDataFromSuccessAuth(request, response),
		);

		return this.router;
	}
}
