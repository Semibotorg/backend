import { Router } from 'express';
import { container } from 'tsyringe';
import { StripeAuthController } from '../controllers/stripe-auth.controller';

const router = Router();
const stripeAuthController = container.resolve(StripeAuthController);

router.use('/', stripeAuthController.routes());

export { router as StripeAuthRouter };
