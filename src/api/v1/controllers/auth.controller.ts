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

	getAuthRoute(request: Request, response: Response) {
		const text = this.AuthService.getHelloWorld();
		return response.status(200).send({ text });
	}

	redirectToLoginPage(request: Request, response: Response) {
		response.redirect(this.envData.DISCORD_AUTH_URL);
	}

	async authorizeUser(request: Request, response: Response) {
		const code = request.query.code;
		const error = request.query.error;
		if (error) return response.status(200).send(`<script>window.close();</script>`);
		if (!code) return response.status(400).send({ msg: 'wrong code' });

		const data = await this.AuthService.getAccessToken(
			this.envData.DISCORD_CLIENT_ID,
			this.envData.DISCORD_CLIENT_SECRET,
			this.envData.DISCORD_REDITECT_URL,
			scopes,
			code,
		);
		console.log(data);
		return response.status(200).send(data);
	}
	
	routes() {
		this.router.get('/login', (request, response) => this.redirectToLoginPage(request, response));
		this.router.get('/callback', async (request, response) => await this.authorizeUser(request, response));
		return this.router;
	}
}
