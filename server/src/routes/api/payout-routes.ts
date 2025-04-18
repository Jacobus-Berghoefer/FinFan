import { Router } from 'express';
import { initModels } from '../../models/index.js';
import sequelize from '../../config/connection.js';
import type { IMatchupInstance } from '../../models/matchup.js';
import type { IBetInstance } from '../../models/bet.js';
import { BetStatus } from '../../utils/constants.js';
import { processPayoutsForMatchup } from '../../utils/payoutProcessor.js';

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
        bet.status =
          bet.pick === parseInt(winnerId)
            ? BetStatus.WON
            : BetStatus.LOST;
        await bet.save();
      })
    );

    return res.json({ matchup, updatedBets: bets });
  } catch (err) {
    console.error('Error setting matchup winner:', err);
    return res.status(500).json({ error: 'Failed to set matchup winner' });
  }
});

router.post('/payouts/:matchupId', async (req, res) => {
    const { matchupId } = req.params;
  
    try {
      const { matchup, results } = await processPayoutsForMatchup(models, Number(matchupId));
      return res.json({ matchup_id: matchup.id, winner_id: matchup.winner_id, updated_bets: results });
    } catch (err) {
      console.error('Error processing payouts:', err);
      return res.status(500).json({ error: 'Failed to process payouts' });
    }
  });

export default router;