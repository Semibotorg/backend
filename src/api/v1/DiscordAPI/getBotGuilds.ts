/* eslint-disable unicorn/filename-case */

import axios from 'axios';
import { Routes, RESTGetAPICurrentUserGuildsResult } from 'discord-api-types/v10';
import { DISCORD_API_URL, DISCORD_API_VERSION } from '../../../config/constants';

export async function getBotGuilds(token_type: 'Bot', bot_token: string) {
	const result = await axios.get(`${DISCORD_API_URL}/${DISCORD_API_VERSION}/${Routes.userGuilds()}?with_counts=true`, {
		headers: {
			Authorization: `${token_type} ${bot_token}`,
		},
	});

	return result.data as RESTGetAPICurrentUserGuildsResult;
}
