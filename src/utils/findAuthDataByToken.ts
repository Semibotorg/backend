/* eslint-disable unicorn/filename-case */

import prisma from '../api/v1/services/prisma.service';

export async function findAuthDataByToken(encrypted_token: string) {
	const data = await prisma.userAccessToken.findFirst({
		where: {
			encryptedToken: encrypted_token,
		},
	});

	return data;
}
