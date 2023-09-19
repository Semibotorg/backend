/* eslint-disable unicorn/filename-case */
import client from '../services/discord.service';

export async function checkIfBotHasAdministrator(guild_id: string) {
	if (!guild_id) return false;

	const guild = await client.guilds.cache.get(guild_id);
	if (!guild) return false;

	const botMe = guild.members.me;
	if (!botMe) return false;

	return botMe.permissions.has('Administrator') ? true : false;
}
