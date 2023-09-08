import { Router, Request, Response } from 'express';

export class SubscriptionController {
	router: Router;

	getHelloWorld(request: Request, response: Response) {
		return response.send({ msg: 'hello world' });
	}

	routes() {
		this.router.get('/', (request: Request, response: Response) => this.getHelloWorld(request, response));

		return this.router;
	}
}
