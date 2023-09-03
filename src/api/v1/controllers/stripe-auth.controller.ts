import { Router, Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { StripeAuthService } from '../services/stripe-auth.service';

@autoInjectable()
export class StripeAuthController {
	envData = process.env;
	router: Router;
	StripeAuthService: StripeAuthService;

	constructor(StripeAuthService: StripeAuthService) {
		this.StripeAuthService = StripeAuthService;
		this.router = Router();
	}

	async redirectToStripeAuthLink(request: Request, response: Response) {
		try {
			const authUrl = await this.StripeAuthService.generateStripeOauthUrl();

			response.status(200).redirect(authUrl);
		} catch (error) {
			console.log(error);
			response.send({ msg: 'an error has been occured' });
		}
	}

	async getStripeAccountDataFromSuccessAuth(request: Request, response: Response) {
		try {
			const code = request.query.code as string;
			// const discord_user_id = request.body.discord_user_id;
			// const guild_id = request.body.guild_id;

			const discord_user_id = '00000000';
			const guild_id = '00000000';

			const stripeData = await this.StripeAuthService.getStripeDataFromAuthCode(code);

			const savedPaymentMethod = await this.StripeAuthService.saveStripeAuthData(
				stripeData.stripe_user_id,
				discord_user_id,
				guild_id,
			);
			response.status(200).send(savedPaymentMethod);
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
