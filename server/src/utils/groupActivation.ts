// utils/groupActivation.ts
import type { IBetInstance } from '../models/bet.js';
import type { Models } from '../models/index.js';
import { Op } from 'sequelize';

export const matchAndActivateGroup = async (
  models: Models,                    
  matchup_id: number,
  week: number,
  group_id: string,
  pick: number,
  amount: number
): Promise<'pending' | 'active'> => {
  const existingGroupBets = await models.Bet.findAll({
    where: {
      matchup_id,
      week,
      group_id,
      status: { [Op.in]: ['pending', 'active'] },
    },
  }) as IBetInstance[];

  const existingAmount = existingGroupBets[0]?.amount;
  if (existingAmount !== undefined && existingAmount !== amount) {
    throw new Error(`All bets in this group must be for the same amount: ${existingAmount}`);
  }

  const opposingExists = existingGroupBets.some(bet => bet.pick !== pick);

  if (opposingExists) {
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
    return 'active';
  }

  return 'pending';
};