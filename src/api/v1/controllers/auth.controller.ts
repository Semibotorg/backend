import { Router, Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { AuthService } from '../services/auth.service';
import { scopes } from '../../../config/constants';
@autoInjectable()
export class AuthController {
	AuthService: AuthService;
	router: Router;
	envData = process.env;

	constructor(AuthService: AuthService) {
		this.AuthService = AuthService;
		this.router = Router();
	}

	redirectToLoginPage(request: Request, response: Response) {
		response.redirect(this.envData.DISCORD_AUTH_URL);
	}

	async authorizeUser(request: Request, response: Response) {
		const code = request.query.code;
		const error = request.query.error;
		if (error) return response.status(200).send(`<script>window.close();</script>`);
		if (!code) return response.status(400).send({ msg: 'wrong code' });
		try {
			const data = await this.AuthService.getAccessToken(
				this.envData.DISCORD_CLIENT_ID,
				this.envData.DISCORD_CLIENT_SECRET,
				this.envData.DISCORD_REDIRECT_URL,
				scopes,
				code,
			);

			const validateData = this.AuthService.validateAccessTokenData(data);
			if (!validateData) return response.status(400).send({ msg: 'Oauth2 data is not valid' });

			const user = await this.AuthService.saveUserAuthDataToDatabase(data);

			const dataForClient = {
				token: user.encryptedToken,
			};
			return response
				.status(200)
				.send(`<script>window.opener.postMessage('${JSON.stringify(dataForClient)}', "*"); window.close(); </script>`);
		} catch (error_) {
			console.log(error_);
			return response.status(400).send({ msg: 'Invalid "code" in request or an error occured while authorzing.' });
		}
	}

	routes() {
		this.router.get('/login', (request, response) => this.redirectToLoginPage(request, response));
		this.router.get('/callback', async (request, response) => await this.authorizeUser(request, response));
		return this.router;
	}
}
