import { Router, Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { AuthService } from '../services/auth.service';

@autoInjectable()
export class AuthController {
	AuthService: AuthService;
	router: Router;
	constructor(AuthService: AuthService) {
		this.AuthService = AuthService;
		this.router = Router();
	}

	getAuthRoute(request: Request, response: Response) {
		const text = this.AuthService.getHelloWorld();
		return response.status(200).send({ text });
	}

	routes() {
		this.router.get('/', (request, response) => this.getAuthRoute(request, response));
		return this.router;
	}
}
