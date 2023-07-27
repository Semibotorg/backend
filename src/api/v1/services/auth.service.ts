import { autoInjectable } from 'tsyringe';
import { RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';
import { exchangeOauth2Token, getUser } from '../DiscordAPI';
import prisma from './prisma.service';
import crypto from 'node:crypto';

@autoInjectable()
export class AuthService {
	constructor() {}

	async getAccessToken(clientId, clientSecret, redirectUrl, scopes: string[], code) {
		const data = new URLSearchParams();
		data.append('client_id', clientId);
		data.append('client_secret', clientSecret);
		data.append('grant_type', 'authorization_code');
		data.append('redirect_uri', redirectUrl);
		data.append('scope', scopes.join(' '));
		data.append('code', code);

		const exchangeOauth2TokenResult = await exchangeOauth2Token(data);

		return exchangeOauth2TokenResult;
	}

	async saveUserAuthDataToDatabase(data: RESTPostOAuth2AccessTokenResult) {
		const encryptedToken = crypto.randomBytes(64).toString('base64');
		const discordUser = await getUser({ access_token: data.access_token, token_type: 'Bearer' });

		const accessTokenData = await prisma.userAccessToken.upsert({
			where: { id: discordUser.id },
			create: {
				...data,
				encryptedToken: encryptedToken,
				id: discordUser.id,
			},
			update: {
				...data,
				id: discordUser.id,
			},
		});

		return accessTokenData;
	}

	validateAccessTokenData(data: RESTPostOAuth2AccessTokenResult) {
		return !!data.access_token && !!data.expires_in && !!data.refresh_token && !!data.scope && !!data.token_type;
	}
}
