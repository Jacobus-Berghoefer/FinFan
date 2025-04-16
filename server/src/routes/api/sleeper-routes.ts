import { Router } from 'express';
import { getLeagueUsers } from '../../service/sleeperService.js';
import { initModels } from '../../models/index.js';
import sequelize from '../../config/connection.js';
import type { SleeperUser } from '../../types/sleeper.js';
import type { IUserInstance } from '../../models/user.js';
import type { ILeagueInstance } from '../../models/league.js';
import { getCurrentSleeperSeason } from '../../utils/getSleeperSeason.js';

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
router.post('/link', async (req, res) => {
  const { sleeper_id, avatar, display_name } = req.body;
  const userSession = req.cookies?.session;

  if (!sleeper_id || !userSession?.id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const user = await models.User.findByPk(userSession.id) as IUserInstance | null;

    if (!user) {
      return res.status(404).json({ error: 'Local user not found' });
    }

    user.sleeper_id = sleeper_id;
    user.avatar = avatar || null;
    user.sleeper_linked = true;

    // 🔐 Store the original Sleeper name permanently in its own column
    user.sleeper_display_name = display_name;

    // 🧠 Optionally overwrite the display_name if the user chose to use Sleeper name
    // NOTE: your frontend sends the `display_name` value already chosen, so we just save it
    user.display_name = display_name;

    await user.save();

    return res.json({
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      avatar: user.avatar,
      sleeper_id: user.sleeper_id,
      sleeper_linked: user.sleeper_linked,
      sleeper_display_name: user.sleeper_display_name,
    });
  } catch (err) {
    console.error('Error linking Sleeper account:', err);
    return res.status(500).json({ error: 'Failed to link Sleeper account' });
  }
});

// GET /api/sleeper/user/leagues
router.get('/user/leagues', async (req, res) => {
  const session = req.cookies?.session;

  if (!session || !session.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await models.User.findByPk(session.id) as IUserInstance | null;
    if (!user || !user.sleeper_id) {
      return res.status(404).json({ error: 'Sleeper account not linked' });
    }

    const season = getCurrentSleeperSeason();
    console.log("Fetching leagues for season:", season);
    const response = await fetch(`https://api.sleeper.app/v1/user/${user.sleeper_id}/leagues/nfl/${season}`);
    const leagues = await response.json();

    return res.json(leagues);
  } catch (err) {
    console.error("Failed to fetch Sleeper leagues:", err);
    return res.status(500).json({ error: 'Could not fetch leagues from Sleeper' });
  }
});

export default router;
