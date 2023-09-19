/* eslint-disable unicorn/filename-case */
import client from '../services/discord.service';

export async function checkIfUserInsideGuild(guild_id: string, discord_user_id: string) {
	if (!guild_id || !discord_user_id) return false;
	const guild = await client.guilds.cache.get(guild_id);
	if (!guild) return false;

	const user = guild.members.cache.get(discord_user_id);
	if (!user) return false;
	return user.displayName ? true : false;
}
