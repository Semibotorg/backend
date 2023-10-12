import { autoInjectable } from 'tsyringe';
import { getBotGuilds, getGuild, getUserGuilds } from '../DiscordAPI';
import { getMatualGuilds } from '../../../utils/getMatualGuilds';

@autoInjectable()
export class UserService {
	async getGuilds(user_access_token: string) {
		const userGuilds = await getUserGuilds('Bearer', user_access_token);
		const botGuilds = await getBotGuilds();

		const matualGuilds = getMatualGuilds(userGuilds, botGuilds);

		return matualGuilds;
	}

	async getGuild(guildId: string) {
		const guild = await getGuild('Bot', process.env.DISCORD_BOT_TOKEN, guildId);
		return guild;
	}
}
