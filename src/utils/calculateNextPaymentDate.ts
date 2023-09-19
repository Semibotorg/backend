/* eslint-disable unicorn/filename-case */

import moment from 'moment';

export function calculateNextPaymentDate(normalDate) {
	const currentDate = moment(normalDate).add(30, 'days').format('YYYY-MM-DD');

	return currentDate;
}
