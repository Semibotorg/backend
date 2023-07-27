/* eslint-disable unicorn/filename-case */
import { Request, Response, NextFunction } from 'express';
import prisma from '../services/prisma.service';

async function getUserDataByEncryptedToken(encryptedToken: string) {
	const user = await prisma.userAccessToken.findFirst({
		where: {
			encryptedToken: encryptedToken,
		},
	});

	return user;
}

export async function authGuard(request: Request, response: Response, next: NextFunction) {
	const token = request.headers.authorization;
	if (!token) return response.status(401).send({ msg: 'The authorization token not found in headers' });

	const data = await getUserDataByEncryptedToken(token);

	if (!data) return response.status(401).send({ msg: 'Unauthorized' });

	next();
}
