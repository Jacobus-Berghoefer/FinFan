// server/src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth-routes.js';
import sleeperRoutes from './api/sleeper-routes.js'; // if added

const router = Router();
router.use('/auth', authRoutes);
router.use('/', sleeperRoutes); // or '/sleeper'

export default router;
