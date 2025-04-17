// server/src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth-routes.js';
import sleeperRoutes from './api/sleeper-routes.js';
import userRoutes from './api/user-routes.js';
import buyinRoutes from './api/buyin-routes.js';
import matchupRoutes from './api/matchup-routes.js';
import betRoutes from './api/bet-routes.js';
import payoutRoutes from './api/payout-routes.js';
import sideBetRoutes from './api/sidebet-routes.js';

const router = Router();
router.use('/sleeper', sleeperRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/buyin', buyinRoutes);
router.use('/matchup', matchupRoutes);
router.use('/bet', betRoutes);
router.use('/payout', payoutRoutes);
router.use('/sidebet', sideBetRoutes);

export default router;
