/* eslint-disable unicorn/filename-case */
import client from '../services/discord.service';

export async function setMultipleRolesForUser(guild_id: string, discord_user_id: string, discord_roles: string[]) {
	if (!guild_id || !discord_user_id || discord_roles.length === 0) return;

	const guild = await client.guilds.cache.get(guild_id);
	if (!guild) return;

	const member = await guild.members.fetch(discord_user_id);
	if (!member) return;

	member.roles.add(discord_roles).catch((error) => {
		console.log(error);
	});
}
