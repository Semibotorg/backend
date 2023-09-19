export interface Subscription {
	tier_id: string;
	discord_user_id: string;
	start_date: string;
	end_date: string;
	status: 'active' | 'deactivated';
	createdAt?: Date;
	guild_id: string;
}
