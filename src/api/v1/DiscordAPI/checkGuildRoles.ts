/* eslint-disable unicorn/filename-case */
import client from '../services/discord.service';

export async function checkGuildRoles(guild_id: string, roleIds: string[]) {
	if (roleIds.length === 0) return false;
	const guild = await client.guilds.cache.get(guild_id);
	if (!guild) return false;

	const roles = guild.roles.cache.filter((role) => roleIds.includes(role.id));
	return roles.size === roleIds.length;
}
