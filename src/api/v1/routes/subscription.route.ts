import { Router } from 'express';
import { container } from 'tsyringe';
import { SubscriptionController } from '../controllers/subscription.controller';
import { authGuard } from '../guards/authGuard';

const router = Router();
const subscriptionController = container.resolve(SubscriptionController);

router.use('/', authGuard, subscriptionController.routes());

export { router as SubscriptionRouter };
