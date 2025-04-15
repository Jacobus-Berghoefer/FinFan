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

// PATCH /api/sleeper/link
router.patch('/link', async (req, res) => {
  const { sleeperUsername, userId, overwriteDisplayName = false } = req.body;

  if (!sleeperUsername || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch(`https://api.sleeper.app/v1/user/${sleeperUsername}`);
    if (!response.ok) {
      return res.status(404).json({ error: 'Sleeper user not found' });
    }

    const sleeperData = await response.json();
    const user = await models.User.findByPk(userId) as IUserInstance | null;

    if (!user) return res.status(404).json({ error: 'Local user not found' });

    user.sleeper_id = sleeperData.user_id;
    user.avatar = sleeperData.avatar;
    user.sleeper_linked = true;

    if (overwriteDisplayName) {
      user.display_name = sleeperData.display_name;
    }

    await user.save();

    return res.json({
      message: 'Sleeper account linked successfully',
      sleeper_id: user.sleeper_id,
      display_name: user.display_name,
      avatar: user.avatar,
      sleeper_linked: user.sleeper_linked,
    });
  } catch (err) {
    console.error('Error linking Sleeper account:', err);
    return res.status(500).json({ error: 'Failed to link Sleeper account' });
  }
});

export default router;
