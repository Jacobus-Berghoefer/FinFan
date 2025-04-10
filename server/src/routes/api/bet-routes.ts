// server/src/routes/api/bet-routes.ts
import { Router } from 'express';
import { initModels } from '../../models/index.js';
import sequelize from '../../config/connection.js';

const router = Router();
const models = initModels(sequelize);

// POST /api/bets
router.post('/bets', async (req, res) => {
  const { user_id, matchup_id, pick, amount, week } = req.body;

  if (!user_id || !matchup_id || !pick || !amount || !week) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // 1. Find all existing bets for the same matchup, same week, and same amount
    const existingBets = await models.Bet.findAll({
      where: { matchup_id, week, amount },
    });

    // 2. Check if there are any opposing bets
    const opposingBets = existingBets.filter((b: any) => b.pick !== pick);
    const samePickBets = existingBets.filter((b: any) => b.pick === pick);

    let newStatus = 'pending';

    if (opposingBets.length > 0) {
      // Mark all opposing bets as active
      await Promise.all(
        opposingBets.map((b: any) => b.update({ status: 'active' }))
      );

      // Same side bets should be active too (for fairness grouping)
      await Promise.all(
        samePickBets.map((b: any) => b.update({ status: 'active' }))
      );

      newStatus = 'active';
    }

    // 3. Create the new bet
    const newBet = await models.Bet.create({
      user_id,
      matchup_id,
      pick,
      amount,
      week,
      status: newStatus,
    });

    return res.status(201).json(newBet);
  } catch (error) {
    console.error('Error placing bet:', error);
    return res.status(500).json({ error: 'Failed to place bet' });
  }
});

export default router;