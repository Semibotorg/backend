import { autoInjectable } from 'tsyringe';
// import prisma from './prisma.service';
import { stripe } from './stripe.service';
import crypto from 'node:crypto';
import prisma from './prisma.service';
import { Subscription } from '../interfaces/types/subscription';

@autoInjectable()
export class SubscriptionService {
	async createPaymentLinkForTier(
		tier: { name: string; price: number },
		connected_stripe_account_id: string,
		is_user_premium: boolean,
		success_url: string,
		cancel_url: string,
	) {
		const feeAmount = Math.round(tier.price * 0.3 * 100); // 30% fee
		const tierPrice = tier.price * 100;
		const checkoutData = await stripe.checkout.sessions.create({
			mode: 'payment',
			line_items: [
				{
					quantity: 1,

					price_data: {
						unit_amount_decimal: tierPrice.toFixed(2),

						currency: 'usd',
						product_data: {
							name: tier.name,
						},
					},
				},
			],
			payment_intent_data: {
				application_fee_amount: is_user_premium ? 0 : feeAmount,
				transfer_data: {
					destination: connected_stripe_account_id,
				},
			},
			success_url,
			cancel_url,
		});

		return checkoutData;
	}

	async saveSubscriptionToDatabase(subscriptionData: Subscription) {
		const data = await prisma.subscription.upsert({
			where: {
				discord_user_id: subscriptionData.discord_user_id,
				guild_id: subscriptionData.guild_id,
			},
			create: subscriptionData,
			update: {
				start_date: subscriptionData.start_date,
				end_date: subscriptionData.start_date,
				status: subscriptionData.status,
				tier_id: subscriptionData.tier_id,
				discord_user_id: subscriptionData.discord_user_id,
			},
		});

		return data;
	}

	async getSubscriptionByUserAndGuild(discord_user_id: string, guild_id: string) {
		const data = await prisma.subscription.findUnique({
			where: {
				discord_user_id,
				guild_id,
			},
		});

		return data;
	}

	async getAllSubscriptionsByGuildId(guild_id: string) {
		const data = await prisma.subscription.findMany({
			where: {
				guild_id,
			},
		});

		return data;
	}

	createReturnUrlCode() {
		const code = crypto.randomBytes(17).toString('base64url');

		return code;
	}
}
