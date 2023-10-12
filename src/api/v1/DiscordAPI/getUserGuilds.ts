/* eslint-disable unicorn/filename-case */

import axios from 'axios';
import { Routes, RESTGetAPICurrentUserGuildsResult } from 'discord-api-types/v10';
import { DISCORD_API_URL, DISCORD_API_VERSION } from '../../../config/constants';

export async function getUserGuilds(token_type: 'Bearer', access_token: string) {
	const result = await axios.get(`${DISCORD_API_URL}/${DISCORD_API_VERSION}/${Routes.userGuilds()}`, {
		headers: {
			Authorization: `${token_type} ${access_token}`,
		},
	});

	return result.data as RESTGetAPICurrentUserGuildsResult;
}
