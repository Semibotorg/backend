import { Router } from 'express';
import { container } from 'tsyringe';
import { SubscriptionController } from '../controllers/subscription.controller';

const router = Router();
const subscriptionController = container.resolve(SubscriptionController);

router.use('/subscription', subscriptionController.routes());

export { router as SubscriptionRouter };
