/* eslint-disable unicorn/filename-case */
import axios from 'axios';
import { DISCORD_API_URL, DISCORD_API_VERSION } from '../../../config/constants';
import { Routes, RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';

export async function exchangeOauth2Token(parametersData: URLSearchParams) {
	const result = await axios.post(
		`${DISCORD_API_URL}/${DISCORD_API_VERSION}${Routes.oauth2TokenExchange()}`,
		parametersData.toString(),
		{
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		},
	);

	return result.data as RESTPostOAuth2AccessTokenResult;
}
