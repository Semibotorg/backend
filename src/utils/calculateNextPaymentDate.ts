/* eslint-disable unicorn/filename-case */

import moment from 'moment';

export function calculateNextPaymentDate(normalDate, afterDays: number, format: 'date' | 'timestamp') {
	const currentDate = moment(normalDate)
		.add(afterDays, 'days')
		.format(format === 'date' ? 'YYYY-MM-DD' : 'x');

	return currentDate;
}
