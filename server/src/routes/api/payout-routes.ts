import { Router } from 'express';
import sequelize from '../../config/connection.js';
import { initModels } from '../../models/index.js';
import type { IBetInstance } from '../../models/bet.js';
import type { IPayoutInstance } from '../../models/payout.js';
import type { IMatchupInstance } from '../../models/matchup.js';
import { adjustUserBalance } from '../../utils/balance.js';
import { BetStatus, PayoutStatus } from '../../utils/constants.js';
import { processPayoutsForMatchup } from '../../utils/payoutProcessor.js';

const router = Router();
const models = initModels(sequelize);

// POST /api/payouts/:matchupId
router.post('/payouts/:matchupId', async (req, res) => {
  const { matchupId } = req.params;

  try {
    const matchup = await models.Matchup.findByPk(matchupId) as IMatchupInstance | null;
    if (!matchup || !matchup.winner_id) {
      return res.status(400).json({ error: 'Matchup not found or winner not set' });
    }

    const activeBets = await models.Bet.findAll({
      where: { matchup_id: matchupId, status: BetStatus.ACTIVE },
    }) as IBetInstance[];

    const grouped = new Map<string, IBetInstance[]>();
    for (const bet of activeBets) {
      if (bet.group_id) {
        if (!grouped.has(bet.group_id)) grouped.set(bet.group_id, []);
        grouped.get(bet.group_id)!.push(bet);
      }
    }

    const results: IPayoutInstance[] = [];

    for (const [group_id, groupBets] of grouped.entries()) {
      const winners = groupBets.filter(b => b.pick === matchup.winner_id);
      const losers = groupBets.filter(b => b.pick !== matchup.winner_id);

      if (winners.length === 0) continue;

      const totalLosingStake = losers.reduce((sum, b) => sum + b.amount, 0);
      const payoutPerWinner = totalLosingStake / winners.length;

      for (const bet of winners) {
        await models.Bet.update({ status: BetStatus.WON }, { where: { id: bet.id } });
        await adjustUserBalance(bet.user_id, payoutPerWinner, models);

        const payout = await models.Payout.create({
          user_id: bet.user_id,
          matchup_id: parseInt(matchupId),
          bet_id: bet.id,
          amount: payoutPerWinner,
          status: PayoutStatus.WON,
          created_at: new Date(),
          group_id,
        });

        results.push(payout);
      }

      for (const bet of losers) {
        await models.Bet.update({ status: BetStatus.LOST }, { where: { id: bet.id } });

        const payout = await models.Payout.create({
          user_id: bet.user_id,
          matchup_id: parseInt(matchupId),
          bet_id: bet.id,
          amount: 0,
          status: PayoutStatus.LOST,
          created_at: new Date(),
        });

        results.push(payout);
      }
    }

    return res.json({ matchup_id: matchupId, winner_id: matchup.winner_id, updated_bets: results });
  } catch (err) {
    console.error('Error processing payouts:', err);
    return res.status(500).json({ error: 'Failed to process payouts' });
  }
});

// GET /api/payouts/:userId
router.get('/payouts/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const payouts = await models.Payout.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
    });

    res.json(payouts);
  } catch (err) {
    console.error('Error fetching payouts:', err);
    res.status(500).json({ error: 'Failed to fetch payouts' });
  }
});

export default router;
