/* eslint-disable unicorn/filename-case */
import axios from 'axios';
import { Routes, RESTGetAPICurrentUserResult } from 'discord-api-types/v10';
import { DISCORD_API_URL, DISCORD_API_VERSION } from '../../../config/constants';

export async function getUser(data: { access_token: string; token_type: 'Bearer' }) {
	const result = await axios.get(`${DISCORD_API_URL}/${DISCORD_API_VERSION}${Routes.user()}`, {
		headers: {
			Authorization: `${data.token_type} ${data.access_token}`,
		},
	});

	return result.data as RESTGetAPICurrentUserResult;
}
