import { Router } from 'express';
import { container } from 'tsyringe';
import { TiersContoller } from '../controllers/tiers.controller';
import { authGuard } from '../guards/authGuard';

const router = Router();

const tiersController = container.resolve(TiersContoller);

router.use('/', authGuard, tiersController.routes());

export { router as TiersRouter };
