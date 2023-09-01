import { Router, Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { StripeAuthService } from '../services/stripe-auth.service';

@autoInjectable()
export class StripeAuthController {
	envData = process.env;
	router: Router;
	StripeAuthService: StripeAuthService;

	constructor(StripeAuthService: StripeAuthService) {
		this.StripeAuthService = StripeAuthService;
		this.router = Router();
	}

	getHelloWorld(request: Request, response: Response) {
		response.status(200).send({ msg: 'hello world' });
	}

	routes() {
		this.router.get('/', (request: Request, response: Response) => this.getHelloWorld(request, response));

		return this.router;
	}
}
