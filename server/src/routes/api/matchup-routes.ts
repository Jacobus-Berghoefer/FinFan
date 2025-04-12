import { Router } from 'express';
//import { Op } from 'sequelize';
import sequelize from '../../config/connection.js';
import { initModels } from '../../models/index.js';
import type { IMatchupInstance } from '../../models/matchup.js';
import type { IBetInstance } from '../../models/bet.js';
//import type { IUserInstance } from '../../models/user.js';


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

// GET /api/matchups/:userId/current
//use this version once dynamic data is in place, for now use mock version below
// router.get('/matchups/:userId/current', async (req, res) => {
//   const userId = parseInt(req.params.userId, 10);
//   const currentWeek = 1; // You can replace with dynamic logic later

//   try {
//     const matchup = await models.Matchup.findOne({
//       where: {
//         week: currentWeek,
//         [Op.or]: [
//           { team1_id: userId },
//           { team2_id: userId },
//         ]
//       }
//     }) as IMatchupInstance | null;

//     if (!matchup) {
//       return res.status(404).json({ error: 'No matchup found for current week' });
//     }

//     const opponentId = matchup.team1_id === userId ? matchup.team2_id : matchup.team1_id;
//     const opponent = await models.User.findByPk(opponentId) as IUserInstance | null;

//     if (!opponent) {
//       return res.status(404).json({ error: 'Opponent not found' });
//     }

//     return res.json({ opponentName: opponent.display_name });
//   } catch (err) {
//     console.error('Error fetching current opponent:', err);
//     return res.status(500).json({ error: 'Failed to fetch opponent' });
//   }
// });

// GET /api/matchups/:userId/current
//delete this route once dynamic data fetching is in place
router.get('/matchups/:userId/current', async (_req, res) => {

  try {
    // 💡 MOCK LOGIC ONLY — skip DB queries and return fake opponent
    const mockOpponent = {
      id: 456,
      display_name: "Brobeak",
      avatar: "https://example.com/avatar.png",
    };

    return res.json({ opponentName: mockOpponent.display_name });
  } catch (err) {
    console.error('Error fetching current opponent:', err);
    return res.status(500).json({ error: 'Failed to fetch opponent' });
  }
});

export default router;
