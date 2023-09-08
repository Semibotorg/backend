/* eslint-disable unicorn/filename-case */
import client from '../services/discord.service';

export async function checkIfUserHasAdministrator(guild_id: string, discord_user_id: string) {
	const guild = await client.guilds.cache.get(guild_id);
	const member = await guild.members.fetch(discord_user_id);

	return member.permissions.has('Administrator') ? true : false;
}
