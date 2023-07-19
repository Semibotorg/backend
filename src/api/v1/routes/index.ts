import express from 'express';
import { AuthRouter } from './auth.route';

const router = express.Router();

router.use('/auth', AuthRouter);

export { router as MainRoutes };
