import { Router } from 'express';
import { initModels } from '../../models/index.js';
import sequelize from '../../config/connection.js';
import type { IUserInstance } from '../../models/user.js';
import type { ILeagueInstance } from '../../models/league.js';

const router = Router();
const models = initModels(sequelize);

// PATCH /api/user/display-name
router.patch('/display-name', async (req, res) => {
  const { newDisplayName } = req.body;
  const session = req.cookies?.session;

  if (!session || !session.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!newDisplayName) {
    return res.status(400).json({ error: 'Missing new display name' });
  }

  try {
    const user = await models.User.findByPk(session.id) as IUserInstance | null;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.display_name = newDisplayName;
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
    console.error('Error updating display name:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/user/unlink-sleeper
router.delete('/unlink-sleeper', async (req, res) => {
  const session = req.cookies?.session;

  if (!session || !session.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await models.User.findByPk(session.id) as IUserInstance | null;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const shouldResetDisplayName = user.display_name === user.sleeper_display_name;

    user.sleeper_id = null;
    user.sleeper_display_name = null;
    user.avatar = null;
    user.sleeper_linked = false;

    if (shouldResetDisplayName) {
      user.display_name = user.username;
    }

    await user.save();

    return res.json({ success: true });
  } catch (err) {
    console.error('Error unlinking Sleeper account:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/user/link-league
router.post('/link-league', async (req, res) => {
  const session = req.cookies?.session;
  const { league_id } = req.body;

  if (!session || !session.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!league_id) {
    return res.status(400).json({ error: 'Missing league_id' });
  }

  try {
    const user = await models.User.findByPk(session.id) as IUserInstance | null;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 🔍 Find or create the league
    await models.League.findOrCreate({
      where: { sleeper_league_id: league_id },
      defaults: {
        league_name: "Unknown League",
        season_year: new Date().getFullYear().toString(),
      },
    });

    // 🧠 Force fresh fetch to ensure league.id exists and FK constraint is satisfied
    const leagueInstance = await models.League.findOne({
      where: { sleeper_league_id: league_id },
    }) as ILeagueInstance;

    if (!leagueInstance || !leagueInstance.id) {
      return res.status(500).json({ error: 'Failed to retrieve league instance' });
    }

    console.log('Verified league instance:', leagueInstance?.toJSON?.());
    console.log('User ID:', user.id);

    // 👥 Link the user to the league
    await user.addLeague(leagueInstance);

    // 🔁 Return updated list of linked leagues
    const updatedLeagues = await user.getLeagues({
      attributes: ['sleeper_league_id', 'league_name', 'season_year'],
      joinTableAttributes: [],
    });

    return res.json({
      success: true,
      message: `League ${league_id} linked successfully.`,
      leagues: updatedLeagues,
    });
  } catch (err) {
    console.error("Error linking league:", err);
    return res.status(500).json({ error: 'Failed to link league' });
  }
});

// GET /api/user/linked-leagues
router.get('/linked-leagues', async (req, res) => {
  const session = req.cookies?.session;

  if (!session?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await models.User.findByPk(session.id) as IUserInstance | null;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const linkedLeagues = await user.getLeagues({
      attributes: ['sleeper_league_id', 'league_name', 'season_year'],
      joinTableAttributes: [],
    });

    return res.json(linkedLeagues);
  } catch (err) {
    console.error('Error fetching linked leagues:', err);
    return res.status(500).json({ error: 'Failed to fetch linked leagues' });
  }
});

export default router;