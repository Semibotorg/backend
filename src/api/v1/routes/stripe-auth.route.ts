import { Router } from 'express';
import { container } from 'tsyringe';
import { StripeAuthController } from '../controllers/stripe-auth.controller';
import { authGuard } from '../guards/authGuard';

const router = Router();
const stripeAuthController = container.resolve(StripeAuthController);

router.use('/', authGuard, stripeAuthController.routes());

export { router as StripeAuthRouter };
