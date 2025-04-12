// server/src/routes/api/sidebet-routes.ts
import { Router } from 'express';
import sequelize from '../../config/connection.js';
import { initModels } from '../../models/index.js';
import { adjustUserBalance } from '../../utils/balance.js';

const router = Router();
const models = initModels(sequelize);

// 1. Create a new weekly side bet
router.post('/sidebets', async (req, res) => {
  const { description, week } = req.body;

  try {
    const sideBet = await models.SideBet.create({
      description,
      week,
      amount: 0, // start at 0, build from user entries
    });
    res.status(201).json(sideBet);
  } catch (err) {
    console.error('Error creating side bet:', err);
    res.status(500).json({ error: 'Failed to create side bet' });
  }
});

// 2. User joins a side bet
router.post('/sidebets/:id/entry', async (req, res) => {
  const side_bet_id = parseInt(req.params.id, 10);
  const { user_id, player_name, player_position, amount } = req.body;

  try {
    // Prevent duplicate entry
    const existingEntry = await models.SideBetEntry.findOne({
      where: {
        user_id,
        side_bet_id,
      },
    });
  
    if (existingEntry) {
      return res.status(400).json({ error: 'User has already entered this side bet' });
    }
  
    // Deduct from user's balance
    await adjustUserBalance(user_id, -amount, models);
  
    const entry = await models.SideBetEntry.create({
      user_id,
      side_bet_id,
      player_name,
      player_position,
      amount,
      status: 'joined',
      score: 0, // Safe since we have default, but explicitly clear
    });
  
    await models.SideBet.increment('amount', {
      by: amount,
      where: { id: side_bet_id },
    });
  
    return res.status(201).json(entry);
  } catch (err) {
    console.error('Error entering side bet:', err);
    return res.status(500).json({ error: 'Failed to enter side bet' });
  }
});

// 3. Fetch a side bet for a specific week (with all entries)
router.get('/sidebets/week/:week', async (req, res) => {
  const { week } = req.params;

  try {
    const sideBet = await models.SideBet.findOne({
      where: { week },
      include: [{ model: models.SideBetEntry }],
    });

    if (!sideBet) return res.status(404).json({ error: 'No side bet found for this week' });

    return res.json(sideBet);
  } catch (err) {
    console.error('Error fetching side bet for week:', err);
    return res.status(500).json({ error: 'Failed to fetch side bet' });
  }
});

// 4. Resolve side bet and credit winner
router.patch('/sidebets/:id/winner', async (req, res) => {
  const side_bet_id = parseInt(req.params.id, 10);
  const { winner_entry_id } = req.body;

  try {
    const entries = await models.SideBetEntry.findAll({ where: { side_bet_id } });
    const totalPool = entries.reduce((sum, entry) => sum + entry.amount, 0);

    await Promise.all(entries.map(entry =>
      entry.update({ status: entry.id === winner_entry_id ? 'won' : 'lost' })
    ));

    const winnerEntry = entries.find(e => e.id === winner_entry_id);
    if (winnerEntry) {
      await adjustUserBalance(winnerEntry.user_id, totalPool, models);
    }

    await models.SideBet.update(
      { winner_id: winner_entry_id },
      { where: { id: side_bet_id } }
    );

    res.json({ side_bet_id, winner_entry_id, totalPool });
  } catch (err) {
    console.error('Error resolving side bet:', err);
    res.status(500).json({ error: 'Failed to resolve side bet' });
  }
});

export default router;