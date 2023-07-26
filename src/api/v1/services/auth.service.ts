import { autoInjectable } from 'tsyringe';
import { RESTPostOAuth2AccessTokenResult, Routes } from 'discord-api-types/v10';
import axios from 'axios';
import { DISCORD_API_URL, DISCORD_API_VERSION } from '../../../config/constants';
import prisma from './prisma.service';

@autoInjectable()
export class AuthService {
	constructor() {}
	getHelloWorld() {
		return 'hello world';
	}

	async getAccessToken(clientId, clientSecret, redirectUrl, scopes: string[], code) {
		const data = new URLSearchParams();
		data.append('client_id', clientId);
		data.append('client_secret', clientSecret);
		data.append('grant_type', 'authorization_code');
		data.append('redirect_uri', redirectUrl);
		data.append('scope', scopes.join(' '));
		data.append('code', code);

		const exchangeDiscordToken = await axios.post(
			`${DISCORD_API_URL}/${DISCORD_API_VERSION}${Routes.oauth2TokenExchange()}`,
			data.toString(),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			},
		);
		return exchangeDiscordToken.data as RESTPostOAuth2AccessTokenResult;
	}

	async saveUserAccessTokenToDatabase(data: RESTPostOAuth2AccessTokenResult) {
		const accessTokenData = await prisma.userAccessToken.create({
			data,
		});

		return accessTokenData;
	}

	validateAccessTokenData(data: RESTPostOAuth2AccessTokenResult) {
		return !!data.access_token && !!data.expires_in && !!data.refresh_token && !!data.scope && !!data.token_type;
	}
}
