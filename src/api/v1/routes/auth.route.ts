import express from 'express';
import { container } from 'tsyringe';
import { AuthController } from '../controllers/auth.controller';
const router = express.Router();

const authController = container.resolve(AuthController);

router.use('/', authController.routes());

export { router as AuthRouter };
