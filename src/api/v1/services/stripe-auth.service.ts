import { autoInjectable } from 'tsyringe';
import { stripe } from './stripe.service';
import prisma from './prisma.service';

@autoInjectable()
export class StripeAuthService {
	async generateStripeOauthUrl() {
		const url = stripe.oauth.authorizeUrl({
			client_id: process.env.STRIPE_CLIENT_ID,
			response_type: 'code',
			redirect_uri: process.env.STRIPE_OAUTH_RETURN_URL,
		});

		return url;
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
}
