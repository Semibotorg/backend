import express from 'express';
import { AuthRouter } from './auth.route';
import { TiersRouter } from './tiers.route';
import { StripeAuthRouter } from './stripe-auth.route';
import { SubscriptionRouter } from './subscription.route';
import { PremiumSubscriptionRouter } from './premium-subscription.route';
import { UserRouter } from './user.rote';

const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/tiers', TiersRouter);
router.use('/stripe/auth', StripeAuthRouter);
router.use('/subscription', SubscriptionRouter);
router.use('/premium', PremiumSubscriptionRouter);
router.use('/user', UserRouter);

export { router as MainRoutes };
