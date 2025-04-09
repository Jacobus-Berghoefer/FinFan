// server/src/routes/api/buyin-routes.ts
import { Router } from 'express';
import { initModels } from '../../models/index.js';
import sequelize from '../../config/connection.js';
import type { IBuyInInstance } from '../../models/buyin.js';
import type { IUserInstance } from '../../models/user.js';

const router = Router();
const models = initModels(sequelize);

// PATCH /api/buyin/:userId/:leagueId/:season
router.patch('/buyin/:userId/:leagueId/:season', async (req, res) => {
  const { userId, leagueId, season } = req.params;

  try {
    const buyin = await models.BuyIn.findOne({
        where: {
          user_id: parseInt(userId),
          league_id: parseInt(leagueId),
          season,
        },
        include: [
            {
              model: models.User,
              attributes: ['id', 'sleeper_id', 'display_name', 'avatar'],
            },
        ],
      }) as IBuyInInstance & { User: IUserInstance } | null;

    if (!buyin) {
      return res.status(404).json({ error: 'Buy-in record not found' });
    }

    // Toggle paid status
    buyin.paid = !buyin.paid;
    await buyin.save();

    // Re-fetch to reflect updated paid status + included user
    const updated = await models.BuyIn.findByPk(buyin.id, {
        include: [
          {
            model: models.User,
            attributes: ['id', 'sleeper_id', 'display_name', 'avatar'],
          },
        ],
      });

    res.json(updated);
    return;
  } catch (err) {
    console.error('Error toggling buy-in:', err);
    return res.status(500).json({ error: 'Failed to toggle buy-in status' });
  }
});

//GET /api/buyins/:leagueId/:season
router.get('/buyins/:leagueId/:season', async (req, res) => {
    const { leagueId, season } = req.params;
  
    try {
      const buyins = await models.BuyIn.findAll({
        where: {
          league_id: parseInt(leagueId),
          season,
        },
        include: [
          {
            model: models.User,
            attributes: ['id', 'sleeper_id', 'display_name', 'avatar'],
          },
        ],
      });
  
      res.json(buyins);
    } catch (err) {
      console.error('Error fetching buy-ins:', err);
      res.status(500).json({ error: 'Failed to fetch buy-ins' });
    }
  });

export default router;
