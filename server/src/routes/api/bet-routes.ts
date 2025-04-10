// server/src/routes/api/bet-routes.ts
import { Router } from 'express';
import { initModels } from '../../models/index.js';
import sequelize from '../../config/connection.js';
import type { IUserInstance } from '../../models/user.js';
import { adjustUserBalance } from '../../utils/balance.js';
import { matchAndActivateGroup } from '../../utils/groupActivation.js';

const router = Router();
const models = initModels(sequelize);

// POST /api/bets
router.post('/bets', async (req, res) => {
  const { user_id, matchup_id, pick, amount, week, group_id } = req.body;

  if (!user_id || !matchup_id || !pick || !amount || !week || !group_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check user's balance
    const user = await models.User.findByPk(user_id) as IUserInstance | null;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance to place bet' });
    }

      //Use the helper to handle group matching and status logic
      const status = await matchAndActivateGroup(models, matchup_id, week, group_id, pick, amount);

    // Deduct user's balance
    await adjustUserBalance(user_id, -amount, models);
    console.log(`User ${user.display_name} new balance: ${user.balance}`);

    // Create the bet
    const newBet = await models.Bet.create({
      user_id,
      matchup_id,
      pick,
      amount,
      week,
      group_id,
      status,
    });

    return res.json(newBet);
  } catch (err) {
    console.error('Error placing bet:', err);
    return res.status(500).json({ error: 'Failed to place bet' });
  }
});

export default router;
