import express from 'express';
import { AuthRouter } from './auth.route';
import { TiersRouter } from './tiers.route';
import { StripeAuthRouter } from './stripe-auth.route';

const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/tiers', TiersRouter);
router.use('/stripe/auth', StripeAuthRouter);

export { router as MainRoutes };
