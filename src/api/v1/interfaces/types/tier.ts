export interface Tier {
	id?: string;
	name: string;
	price: number;
	made_by: string;
	description: string;
	premium_discord_channels: string[];
	premium_discord_roles: string[];
	premium_additional_benefits: string[];
	timestamp?: Date;
	guild_id: string;
}
