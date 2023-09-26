import { autoInjectable } from 'tsyringe';
import prisma from './prisma.service';
import { Tier } from '../interfaces/types/tier';

@autoInjectable()
export class TiersService {
	async createTier(data: Tier) {
		const tierData = await prisma.tiers.create({
			data,
		});

		return tierData;
	}

	async deleteTier(tier_id: string, guild_id: string) {
		const tierData = await prisma.tiers.delete({
			where: {
				guild_id,
				id: tier_id,
			},
		});

		return tierData;
	}

	async updateTier(tier_id: string, guild_id: string, tier_data: Tier) {
		const tierData = await prisma.tiers.update({
			data: tier_data,
			where: {
				id: tier_id,
				guild_id,
			},
		});

		return tierData;
	}

	async getAllTiersByGuildId(guild_id: string) {
		const data = await prisma.tiers.findMany({
			where: {
				guild_id,
			},
		});

		return data;
	}

	async getTierById(tier_id: string, guild_id: string) {
		const data = await prisma.tiers.findMany({
			where: {
				id: tier_id,
				guild_id,
			},
		});

		return data;
	}

	validateTiersData(data: Tier) {
		return (
			!!data.description &&
			!!data.premium_discord_roles &&
			!!data.guild_id &&
			!!data.made_by &&
			!!data.name &&
			!!data.price &&
			data.price < 2 &&
			data.price > 500
		);
	}
}
