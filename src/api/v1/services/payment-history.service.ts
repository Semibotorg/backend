import { autoInjectable } from 'tsyringe';
import prisma from './prisma.service';
import { PaymentHistory as PaymentHistoryInterface } from '../interfaces/types/PaymentHistory';

@autoInjectable()
export class PaymentHistory {
	async SaveToPaymentHistory(data: PaymentHistoryInterface) {
		const savedData = await prisma.paymentHistory.create({
			data,
		});

		return savedData;
	}

	async completePaymentHistory(returnCode: string) {
		const data = await prisma.paymentHistory.update({
			where: {
				returnCode,
			},
			data: {
				completed: true,
			},
		});

		return data;
	}

	async getPaymentHistory(returnCode: string) {
		const data = await prisma.paymentHistory.findUnique({ where: { returnCode } });

		return data;
	}
}
