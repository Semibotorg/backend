import { Router, Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { TiersService } from '../services/tiers.service';
import { Tier } from '../interfaces/types/tier';
import { checkUserPermission } from '../../../utils/checkUserPermission';
import { findAuthDataByToken } from '../../../utils/findAuthDataByToken';

@autoInjectable()
export class TiersContoller {
	envData = process.env;
	router: Router;
	TiersService: TiersService;

	constructor(TiersService: TiersService) {
		this.TiersService = TiersService;
		this.router = Router();
	}

	async createTier(request: Request, response: Response) {
		try {
			const encrypted_token = request.headers.authorization;
			const auth_data = await findAuthDataByToken(encrypted_token);
			const discord_user_id = auth_data.discord_user_id;
			const requestedData: Tier = {
				name: request.body.name,
				price: request.body.price,
				made_by: discord_user_id,
				description: request.body.description,
				premium_discord_channels: request.body.premium_discord_channels ?? [],
				premium_discord_roles: request.body.premium_discord_roles ?? [],
				premium_additional_benefits: request.body.premium_additional_benefits ?? [],
				guild_id: request.body.guild_id,
			};

			const checkPermission = await checkUserPermission(requestedData.guild_id, discord_user_id);
			if (!checkPermission) return response.status(400).send({ msg: `You don't have ADMINISTRATOR permission` });

			const validateData = this.TiersService.validateTiersData(requestedData);
			if (!validateData || !discord_user_id || !auth_data || !encrypted_token)
				return response.status(400).send({ msg: 'The data you provided is not valid' });
			const data = await this.TiersService.createTier(requestedData);

			return response.status(200).send(data);
		} catch (error) {
			console.log(error);
			response.send({ msg: 'an error has been occured' });
		}
	}

	async updateTier(request: Request, response: Response) {
		try {
			const tier_id = request.params.tierId;

			const encrypted_token = request.headers.authorization;
			const auth_data = await findAuthDataByToken(encrypted_token);
			const discord_user_id = auth_data.discord_user_id;

			const requestedData: Tier = {
				name: request.body.name,
				price: request.body.price,
				made_by: discord_user_id,
				description: request.body.description,
				premium_discord_channels: request.body.premium_discord_channels ?? [],
				premium_discord_roles: request.body.premium_discord_roles ?? [],
				premium_additional_benefits: request.body.premium_additional_benefits ?? [],
				guild_id: request.body.guild_id,
			};

			const checkPermission = await checkUserPermission(requestedData.guild_id, discord_user_id);
			if (!checkPermission) return response.status(400).send({ msg: `You don't have ADMINISTRATOR permission` });

			const validateData = await this.TiersService.validateTiersData(requestedData);
			if (!validateData || !tier_id || !discord_user_id || !auth_data || !encrypted_token)
				return response.status(400).send({ msg: 'The data you provided is not valid' });

			const data = await this.TiersService.updateTier(tier_id, requestedData.guild_id, requestedData);
			return response.status(200).send(data);
		} catch (error) {
			console.log(error);
			response.send({ msg: 'an error has been occured' });
		}
	}

	async deleteTier(request: Request, response: Response) {
		try {
			const encrypted_token = request.headers.authorization;
			const auth_data = await findAuthDataByToken(encrypted_token);
			const discord_user_id = auth_data.discord_user_id;

			const requestedData = {
				guild_id: request.body.guild_id,
				tier_id: request.params.tierId,
			};

			const checkPermission = await checkUserPermission(requestedData.guild_id, discord_user_id);
			if (!checkPermission) return response.status(400).send({ msg: `You don't have ADMINISTRATOR permission` });

			if (!requestedData.tier_id || !requestedData.guild_id || !encrypted_token || !auth_data || !discord_user_id)
				return response.status(400).send({ msg: 'The data you provided is not valid' });

			const data = await this.TiersService.deleteTier(requestedData.tier_id, requestedData.guild_id);
			return response.status(200).send(data);
		} catch (error) {
			console.log(error);
			response.send({ msg: 'an error has been occured' });
		}
	}

	async getTiersByGuildId(request: Request, response: Response) {
		try {
			const encrypted_token = request.headers.authorization;
			const auth_data = await findAuthDataByToken(encrypted_token);
			const discord_user_id = auth_data.discord_user_id;

			const requestedData = {
				guild_id: request.params.id,
			};

			if (!requestedData.guild_id || !discord_user_id || !encrypted_token || !auth_data)
				return response.status(400).send({ msg: 'The data you provided is not valid' });

			const checkPermission = await checkUserPermission(requestedData.guild_id, discord_user_id);
			if (!checkPermission) return response.status(400).send({ msg: `You don't have ADMINISTRATOR permission` });

			const data = await this.TiersService.getAllTiersByGuildId(requestedData.guild_id);
			return response.status(200).send(data);
		} catch (error) {
			console.log(error);
			response.send({ msg: 'an error has been occured' });
		}
	}

	async getTierById(request: Request, response: Response) {
		try {
			const encrypted_token = request.headers.authorization;
			const auth_data = await findAuthDataByToken(encrypted_token);
			const discord_user_id = auth_data.discord_user_id;

			const requestedData = {
				guild_id: request.body.guild_id,
				tier_id: request.params.id,
			};

			if (!requestedData.guild_id || !discord_user_id || !requestedData.tier_id || !encrypted_token || !auth_data)
				return response.status(400).send({ msg: 'The data you provided is not valid' });

			const checkPermission = await checkUserPermission(requestedData.guild_id, discord_user_id);
			if (!checkPermission) return response.status(400).send({ msg: `You don't have ADMINISTRATOR permission` });

			const data = await this.TiersService.getTierById(requestedData.tier_id, requestedData.guild_id);
			return response.status(200).send(data);
		} catch (error) {
			console.log(error);
			response.send({ msg: 'an error has been occured' });
		}
	}

	routes() {
		this.router.post(
			'/create',
			async (request: Request, response: Response) => await this.createTier(request, response),
		);
		this.router.patch(
			'/update/:tierId',
			async (request: Request, response: Response) => await this.updateTier(request, response),
		);
		this.router.delete(
			'/delete/:tierId',
			async (request: Request, response: Response) => await this.deleteTier(request, response),
		);
		this.router.get(
			'/get/guild/:id',
			async (request: Request, response: Response) => await this.getTiersByGuildId(request, response),
		);
		this.router.get(
			'/get/:id',
			async (request: Request, response: Response) => await this.getTierById(request, response),
		);

		return this.router;
	}
}
