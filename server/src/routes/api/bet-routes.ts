// server/src/routes/api/bet-routes.ts
import { Router } from 'express';
import { initModels } from '../../models/index.js';
import sequelize from '../../config/connection.js';
import type { IBetInstance } from '../../models/bet.js';
import { Op } from 'sequelize';

const router = Router();
const models = initModels(sequelize);

// POST /api/bets
router.post('/bets', async (req, res) => {
  const { user_id, matchup_id, pick, amount, week, group_id } = req.body;

  if (!user_id || !matchup_id || !pick || !amount || !week || !group_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Get all existing bets in this group
    const groupBets = await models.Bet.findAll({
      where: {
        matchup_id,
        week,
        group_id,
        status: { [Op.in]: ['pending', 'active'] },
      },
    }) as IBetInstance[];

    // Determine the initial bet amount (if any bets already exist)
    let initialAmount: number | null = null;
    if (groupBets.length > 0) {
      initialAmount = groupBets[0].amount;
      if (amount !== initialAmount) {
        return res.status(400).json({ error: `All bets in this group must be for the same amount: ${initialAmount}` });
      }
    }

    // Count bettors on each side
    const sideCounts = groupBets.reduce(
      (acc, bet) => {
        if (bet.pick === pick) {
          acc.sameSide += 1;
        } else {
          acc.opposingSide += 1;
        }
        return acc;
      },
      { sameSide: 0, opposingSide: 0 }
    );

    // Determine status
    let newStatus: 'pending' | 'active' = 'pending';
    const allSameAmount = groupBets.every(bet => bet.amount === amount);

    if (allSameAmount && sideCounts.opposingSide >= 1) {
      newStatus = 'active';
      await models.Bet.update(
        { status: 'active' },
        {
          where: {
            matchup_id,
            week,
            group_id,
            status: 'pending',
          },
        }
      );
    }

    // Create new bet
    const newBet = await models.Bet.create({
      user_id,
      matchup_id,
      pick,
      amount,
      week,
      group_id,
      status: newStatus,
    });

    return res.json(newBet);
  } catch (err) {
    console.error('Error placing bet:', err);
    return res.status(500).json({ error: 'Failed to place bet' });
  }
});

export default router;
