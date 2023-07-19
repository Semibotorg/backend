import { autoInjectable } from 'tsyringe';

@autoInjectable()
export class AuthService {
	constructor() {}
	getHelloWorld() {
		return 'hello world';
	}
}
