// server/src/routes/api/bet-routes.ts
import { Router } from 'express';
import { initModels } from '../../models/index.js';
import sequelize from '../../config/connection.js';
import type { IBetInstance } from '../../models/bet.js';
import type { IUserInstance } from '../../models/user.js';
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
    // Check user's balance
    const user = await models.User.findByPk(user_id) as IUserInstance | null;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance to place bet' });
    }

    // Find existing bets in this group
    const existingGroupBets = await models.Bet.findAll({
      where: {
        matchup_id,
        week,
        group_id,
        status: { [Op.in]: ['pending', 'active'] },
      },
    }) as IBetInstance[];

    // Enforce fixed amount in group
    const existingAmount = existingGroupBets[0]?.amount;
    if (existingAmount !== undefined && existingAmount !== amount) {
      return res.status(400).json({
        error: `All bets in this group must be for the same amount: ${existingAmount}`,
      });
    }

    const opposingExists = existingGroupBets.some(bet => bet.pick !== pick);

    let newStatus: 'pending' | 'active' = 'pending';
    if (opposingExists) {
      // Activate all matching group bets
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
      newStatus = 'active';
    }

    // Deduct user's balance
    user.balance -= amount;
    await user.save();
    console.log(`User ${user.display_name} new balance: ${user.balance}`);

    // Create the bet
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
