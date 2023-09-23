import { CronJob } from 'cron';
import { checkIfUserSubscriptionIsActive, checkIfGuildPremium } from '../../../utils';

export function runCron() {
	new CronJob('59 * * * * *', async () => {
		await checkIfUserSubscriptionIsActive();
		await checkIfGuildPremium();
	}).start();
}
