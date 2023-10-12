/* eslint-disable unicorn/filename-case */

import client from '../services/discord.service';

export async function getBotGuilds() {
	const guilds = client.guilds.cache.toJSON();
	return guilds;
}
