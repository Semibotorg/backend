/* eslint-disable unicorn/filename-case */
import client from '../services/discord.service';

export async function checkGuildChannels(guild_id: string, channelIds: string[]) {
	if (channelIds.length === 0) return false;
	const guild = await client.guilds.cache.get(guild_id);
	if (!guild) return false;

	const channels = guild.channels.cache.filter((channel) => channelIds.includes(channel.id));
	return channels.size === channelIds.length;
}
