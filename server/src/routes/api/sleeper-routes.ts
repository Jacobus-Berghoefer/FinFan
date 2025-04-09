import { Router } from 'express';
import { getLeagueUsers } from '../../service/sleeperService.js';
import { initModels } from '../../models/index.js';
import sequelize from '../../config/connection.js';
import type { SleeperUser } from '../../types/sleeper.js';
import type { IUserInstance } from '../../models/user.js';
import type { ILeagueInstance } from '../../models/league.js';


const router = Router();
const models = initModels(sequelize);

// GET /api/league/:leagueId/users
router.get('/league/:leagueId/users', async (req, res) => {
  const { leagueId } = req.params;

  try {
    const sleeperUsers = await getLeagueUsers(leagueId);
    console.log('✅ Sleeper API response:', sleeperUsers);

    // 🧠 Ensure the league exists in the DB
    const [league] = await models.League.findOrCreate({
      where: { sleeper_league_id: leagueId },
      defaults: {
        league_name: 'Unknown League Name',
        season_year: new Date().getFullYear().toString(),
      },
    }) as [ILeagueInstance, boolean];

    // ⬇️ Now we can safely insert users and buyins
    const userRecords = await Promise.all(
      sleeperUsers.map(async (sleeperUser: SleeperUser) => {
        const [user] = await models.User.findOrCreate({
          where: { sleeper_id: sleeperUser.user_id },
          defaults: {
            display_name: sleeperUser.display_name,
            avatar: sleeperUser.avatar,
          },
        }) as [IUserInstance, boolean];
    
        await models.BuyIn.findOrCreate({
          where: {
            user_id: user.id,
            league_id: league.id, // 🔥 Use actual DB league ID, not sleeper_id
            season: new Date().getFullYear().toString(),
          },
          defaults: { paid: false },
        });
    
        return user;
      })
    );    

    res.json(userRecords);
  } catch (error) {
    console.error('Error fetching league users:', error);
    res.status(500).json({ error: 'Failed to fetch league users' });
  }
});

export default router;
