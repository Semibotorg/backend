import { CronJob } from 'cron';
import prisma from './prisma.service';
import { nowDate } from '../../../utils';
import { removeMultipleRolesForUser } from '../DiscordAPI';
import moment from 'moment';

export function runCron() {
	new CronJob('59 * * * * *', async () => {
		const subscriptions = await prisma.subscription.findMany();

		for (const data of subscriptions) {
			if (moment(data.end_date).isSameOrBefore(nowDate) && data.status === 'active') {
				const subscription = data;

				await prisma.subscription.update({
					where: {
						discord_user_id: data.discord_user_id,
						guild_id: data.guild_id,
					},
					data: {
						discord_user_id: subscription.discord_user_id,
						createdAt: subscription.createdAt,
						end_date: subscription.end_date,
						guild_id: subscription.guild_id,
						start_date: subscription.start_date,
						tier_id: subscription.tier_id,
						status: 'deactivated',
					},
				});

				const tierOfSubscription = await prisma.tiers.findUnique({
					where: {
						id: subscription.tier_id,
						guild_id: subscription.guild_id,
					},
				});

				await removeMultipleRolesForUser(
					subscription.guild_id,
					subscription.discord_user_id,
					tierOfSubscription.premium_discord_roles,
				);
			}
		}
	}).start();
}
