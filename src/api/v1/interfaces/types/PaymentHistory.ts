/* eslint-disable unicorn/filename-case */

export interface PaymentHistory {
	guild_id: string;
	type: 'subscription' | 'premium-subscription';
	discord_user_id: string;
	paymentMethod: string;
	returnCode: string;
	completed: boolean;
	createdAt?: Date;
}
