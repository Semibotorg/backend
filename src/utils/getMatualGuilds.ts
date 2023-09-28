/* eslint-disable unicorn/filename-case */

import { RESTGetAPICurrentUserGuildsResult } from 'discord-api-types/v10';

export function getMatualGuilds(
	userGuilds: RESTGetAPICurrentUserGuildsResult,
	botGuilds: RESTGetAPICurrentUserGuildsResult,
) {
	if (!userGuilds || !botGuilds) return;
	const validGuilds = userGuilds.filter((guild) => (guild.permissions as bigint & 0x08) === 0x08);
	const included: RESTGetAPICurrentUserGuildsResult = [];
	const excluded = validGuilds.filter((guild) => {
		const findGuild = botGuilds.find((g) => g.id === guild.id);
		if (!findGuild) return guild;
		included.push(findGuild);
	});
	return { excluded, included };
}
