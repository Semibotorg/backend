import { autoInjectable } from 'tsyringe';
import { Router, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { findAuthDataByToken } from '../../../utils';
import { checkIfUserHasAdministrator, getUser } from '../DiscordAPI';

@autoInjectable()
export class UserController {
	UserService: UserService;
	router: Router;
	constructor(UserService: UserService) {
		this.UserService = UserService;
		this.router = Router();
	}

	async getGuilds(request: Request, response: Response) {
		const encrypted_token = request.headers.authorization;
		const auth_data = await findAuthDataByToken(encrypted_token);

		const data = await this.UserService.getGuilds(auth_data.access_token);

		return response.status(200).send(data);
	}

	async getGuild(request: Request, response: Response) {
		const guild_id = request.params.guildId;
		const encrypted_token = request.headers.authorization;
		const auth_data = await findAuthDataByToken(encrypted_token);

		const userHasPermission = await checkIfUserHasAdministrator(guild_id, auth_data.discord_user_id);
		if (!userHasPermission) return response.status(400).send({ msg: 'ADMINISTRATOR required' });

		const guild = await this.UserService.getGuild(guild_id);
		if (!guild) return response.status(400).send({ msg: 'The guild is not valid' });

		return response.status(200).send(guild);
	}

	async getUser(request: Request, response: Response) {
		try {
			const encrypted_token = request.headers.authorization;
			const auth_data = await findAuthDataByToken(encrypted_token);

			const user = await getUser({
				access_token: auth_data.access_token,
				token_type: 'Bearer',
			});

			if (!user) return response.status(400).send({ msg: 'the user is not valid' });

			return response.status(200).send(user);
		} catch (error) {
			response.status(400).send({ msg: 'an error occured' });
			console.log(error);
		}
	}

	routes() {
		this.router.get('/guilds', async (request, response) => await this.getGuilds(request, response));
		this.router.get('/guilds/:guildId', async (request, response) => await this.getGuild(request, response));
		this.router.get('/', async (request, response) => await this.getUser(request, response));

		return this.router;
	}
}
