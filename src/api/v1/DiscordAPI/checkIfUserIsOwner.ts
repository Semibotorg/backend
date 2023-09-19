/* eslint-disable unicorn/filename-case */
import client from '../services/discord.service';

export async function checkIfUserIsOwner(guild_id: string, discord_user_id: string) {
	if (!guild_id || !discord_user_id) return false;

	const guild = await client.guilds.cache.get(guild_id);
	if (!guild) return false;
	const member = await guild.members.fetch(discord_user_id);
	if (!member) return false;
	return member.id === guild.ownerId ? true : false;
}
