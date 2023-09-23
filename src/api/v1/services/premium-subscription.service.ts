import { autoInjectable } from 'tsyringe';
import { stripe } from './stripe.service';
import { PremiumSubscription } from '../interfaces/types/PremiumSubscription';
import prisma from './prisma.service';
import crypto from 'node:crypto';

@autoInjectable()
export class PremiumSubscriptionService {
	async createProduct(product_name: string) {
		const product = await stripe.products.create({
			name: product_name,
		});

		return product;
	}

	async createPrice(product_id: string, amount: number) {
		const amount_formatted = (amount * 100).toFixed(2);
		const price = await stripe.prices.create({
			product: product_id,
			currency: 'USD',
			unit_amount_decimal: amount_formatted,
		});

		return price;
	}

	async createCheckoutSession(success_url: string, cancel_url: string, price_id: string) {
		const checkout = await stripe.checkout.sessions.create({
			line_items: [
				{
					price: price_id,
					quantity: 1,
				},
			],
			success_url,
			cancel_url,
			mode: 'payment',
		});

		return checkout;
	}

	async savePremiumSubscriptionToDatabase(premiumSubscriptionData: PremiumSubscription) {
		const data = await prisma.premiumSubscription.upsert({
			where: {
				guild_id: premiumSubscriptionData.guild_id,
			},
			create: premiumSubscriptionData,
			update: {
				discord_user_id: premiumSubscriptionData.discord_user_id,
				end_date: premiumSubscriptionData.end_date,
				start_date: premiumSubscriptionData.start_date,
				status: premiumSubscriptionData.status,
			},
		});

		return data;
	}

	async getPremiumSubscriptionByGuildId(guild_id: string) {
		const data = await prisma.premiumSubscription.findUnique({
			where: {
				guild_id,
			},
		});

		return data;
	}

	async isGuildPremium(guild_id: string) {
		const data = await prisma.premiumSubscription.findUnique({
			where: {
				guild_id,
			},
		});

		if (data) {
			return data.status == 'active' ? true : false;
		} else return false;
	}

	createReturnUrlCode() {
		const code = crypto.randomBytes(37).toString('base64url');

		return code;
	}
}
