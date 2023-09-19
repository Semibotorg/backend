import * as redis from 'redis';

export class RedisService {
	private readonly client: redis.RedisClientType;
	constructor() {
		this.client = redis.createClient({
			url: process.env.REDIS_URL,
		});
		this.client.connect().then(() => {
			console.log('[REDIS] Ready');
		});
	}

	async setJsonData(key: string, data: object, ttl: number) {
		const value = JSON.stringify(data);
		await this.client.setEx(key, ttl, value);
	}

	async getJsonData(key: string) {
		const value = await this.client.get(key);
		return value ? JSON.parse(value) : undefined;
	}
}
