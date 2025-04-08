// server/src/routes/api/sleeper-routes.ts
import { Router } from 'express';
import { getLeagueUsers } from '../../service/sleeperService';

const router = Router();

router.get('/league/:leagueId/users', async (req, res) => {
  try {
    const leagueId = req.params.leagueId;
    const users = await getLeagueUsers(leagueId);
    res.json(users);
  } catch (error) {
    console.error('Failed to fetch league users:', error);
    res.status(500).json({ error: 'Failed to fetch league users' });
  }
});

export default router;
