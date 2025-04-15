// server/src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth-routes.js';
import sleeperRoutes from './api/sleeper-routes.js';
import userRoutes from './api/user-routes.js';

const router = Router();
router.use('/auth', authRoutes);
router.use('/', sleeperRoutes);
router.use('/user', userRoutes);

export default router;
