import { autoInjectable } from 'tsyringe';
import { stripe } from './stripe.service';
import prisma from './prisma.service';
import crypto from 'node:crypto';

@autoInjectable()
export class StripeAuthService {
	async generateStripeOauthUrl(auth_code: string) {
		const authUrl = stripe.oauth.authorizeUrl({
			client_id: process.env.STRIPE_CLIENT_ID,
			response_type: 'code',
			redirect_uri: process.env.STRIPE_OAUTH_RETURN_URL,
			state: auth_code,
		});

		return authUrl;
	}

	async getStripeDataFromAuthCode(auth_code: string) {
		const stripeData = stripe.oauth.token({
			grant_type: 'authorization_code',
			code: auth_code,
		});

		return stripeData;
	}

	async saveStripeAuthData(connected_stripe_account_id, discord_user_id, guild_id) {
		const authData = await prisma.paymentMethods.upsert({
			where: { guild_id },
			create: {
				discord_user_id,
				connected_stripe_account_id,
				guild_id,
			},
			update: {
				connected_stripe_account_id,
				discord_user_id,
			},
		});

		return authData;
	}

	async filterStripeAccountFromTheList(connected_account_id: string) {
		const accounts = await stripe.accounts.list();

		const filteredAccount = accounts.data.filter((account) => account.id == connected_account_id);

		return filteredAccount;
	}

	async getStripeAuthDataFromGuildId(guild_id: string) {
		const data = await prisma.paymentMethods.findFirst({
			where: {
				guild_id,
			},
		});

		return data;
	}

	createReturnUrlCode() {
		const code = crypto.randomBytes(16).toString('base64');
		return code;
	}
}
