import { Router } from 'express';
import { initModels } from '../../models/index.js';
import sequelize from '../../config/connection.js';
import type { IUserInstance } from '../../models/user.js';

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

export default router;