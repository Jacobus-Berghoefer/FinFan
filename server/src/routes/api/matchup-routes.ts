import { Router } from 'express';
import { initModels } from '../../models/index.js';
import sequelize from '../../config/connection.js';
import type { IMatchupInstance } from '../../models/matchup.js';
import type { IBetInstance } from '../../models/bet.js';

const router = Router();
const models = initModels(sequelize);

// PATCH /api/matchup/:matchupId/winner/:winnerId
router.patch('/matchup/:matchupId/winner/:winnerId', async (req, res) => {
  const { matchupId, winnerId } = req.params;

  try {
    const matchup = await models.Matchup.findByPk(matchupId) as IMatchupInstance | null;

    if (!matchup) {
      return res.status(404).json({ error: 'Matchup not found' });
    }

    matchup.winner_id = parseInt(winnerId);
    await matchup.save();

    const bets = await models.Bet.findAll({
      where: { matchup_id: matchup.id }
    }) as IBetInstance[];

    await Promise.all(
      bets.map(async (bet) => {
        bet.status = bet.pick === parseInt(winnerId) ? 'won' : 'lost';
        await bet.save();
      })
    );

    return res.json({ matchup, updatedBets: bets });
  } catch (err) {
    console.error('Error setting matchup winner:', err);
    return res.status(500).json({ error: 'Failed to set matchup winner' });
  }
});

export default router;
