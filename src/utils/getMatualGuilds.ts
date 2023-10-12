/* eslint-disable unicorn/filename-case */

import { RESTGetAPICurrentUserGuildsResult, PermissionFlagsBits } from 'discord-api-types/v10';
import { Guild } from 'discord.js';

export function getMatualGuilds(userGuilds: RESTGetAPICurrentUserGuildsResult, botGuilds: Guild[]) {
	if (!userGuilds || !botGuilds) return;
	const validGuilds = userGuilds.filter(
		(guild) =>
			(BigInt(guild.permissions) & BigInt(PermissionFlagsBits.Administrator)) ===
			BigInt(PermissionFlagsBits.Administrator),
	);
	const included: Guild[] = [];
	const excluded = validGuilds.filter((guild) => {
		const findGuild = botGuilds.find((g) => g.id === guild.id);
		if (!findGuild) return guild;
		included.push(findGuild);
	});
	return { excluded, included };
}
