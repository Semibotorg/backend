import { Router } from 'express';
import { container } from 'tsyringe';
import { UserController } from '../controllers/user.controller';
import { authGuard } from '../guards/authGuard';

const userController = container.resolve(UserController);
const router = Router();

router.use('/', authGuard, userController.routes());

export { router as UserRouter };
