/* eslint-disable unicorn/filename-case */
export interface PremiumSubscription {
	guild_id: string;
	discord_user_id: string;
	start_date: string;
	end_date: string;
	status: 'active' | 'deactivated';
	createdAt?: Date;
}
