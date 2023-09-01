import { Router, Request, Response } from 'express';
import { autoInjectable } from 'tsyringe';
import { TiersService } from '../services/tiers.service';

@autoInjectable()
export class TiersContoller {
	envData = process.env;
	router: Router;
	TiersService: TiersService;

	constructor(TiersService: TiersService) {
		this.TiersService = TiersService;
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
