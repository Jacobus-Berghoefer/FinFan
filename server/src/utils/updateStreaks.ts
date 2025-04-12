// utils/updateStreaks.ts
import type { Models } from '../models/index.js';
import type { IMatchupInstance } from '../models/matchup.js';
import type { IBetInstance } from '../models/bet.js';

export const updateStreaks = async (
  models: Models,
  matchup: IMatchupInstance,
  winningBets: IBetInstance[],
  losingBets: IBetInstance[]
) => {
  const leagueId = matchup.league_id;

  const updateStat = async (userId: number, result: 'win' | 'loss') => {
    const stat = await models.UserLeagueStats.findOne({
      where: {
        user_id: userId,
        league_id: leagueId,
      },
    });

    if (!stat) {
      await models.UserLeagueStats.create({
        user_id: userId,
        league_id: leagueId,
        current_streak: 1,
        streak_direction: result,
        created_at: new Date(),
        updated_at: new Date(),
      });
    } else {
      const sameDirection = stat.streak_direction === result;
      const newStreak = sameDirection ? (stat.current_streak ?? 0) + 1 : 1;

      await stat.update({
        current_streak: newStreak,
        streak_direction: result,
        updated_at: new Date(),
      });
    }
  };

  await Promise.all([
    ...winningBets.map(bet => updateStat(bet.user_id, 'win')),
    ...losingBets.map(bet => updateStat(bet.user_id, 'loss')),
  ]);
};
