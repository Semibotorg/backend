/* eslint-disable unicorn/filename-case */

import prisma from '../../api/v1/services/prisma.service';
import { nowDate } from '../nowDate';
import moment from 'moment';

export async function checkIfGuildPremium() {
	const premiumSubscriptions = await prisma.premiumSubscription.findMany();

	for (const data of premiumSubscriptions) {
		if (moment(data.end_date).isSameOrBefore(nowDate) && data.status === 'active') {
			const subscription = data;

			await prisma.premiumSubscription.update({
				where: {
					guild_id: data.guild_id,
				},
				data: {
					discord_user_id: subscription.discord_user_id,
					createdAt: subscription.createdAt,
					end_date: subscription.end_date,
					guild_id: subscription.guild_id,
					start_date: subscription.start_date,
					status: 'deactivated',
				},
			});
		}
	}
}
