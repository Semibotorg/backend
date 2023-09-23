import { Router } from 'express';
import { container } from 'tsyringe';
import { PremiumSubscriptionController } from '../controllers/premium-subscription.controller';

const router = Router();
const premiumSubscriptionController = container.resolve(PremiumSubscriptionController);

router.use('/', premiumSubscriptionController.routes());

export { router as PremiumSubscriptionRouter };
