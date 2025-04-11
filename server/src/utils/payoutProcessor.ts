// utils/payoutProcessor.ts
import type { Models } from '../models/index.js';
import type { IMatchupInstance } from '../models/matchup.js';
import type { IBetInstance } from '../models/bet.js';
import type { IPayoutInstance } from '../models/payout.js';
import { adjustUserBalance } from './balance.js';
import { BetStatus, PayoutStatus } from './constants.js';

export const processPayoutsForMatchup = async (
  models: Models,
  matchupId: number
): Promise<{ matchup: IMatchupInstance, results: IPayoutInstance[] }> => {
  const matchup = await models.Matchup.findByPk(matchupId) as IMatchupInstance | null;
  if (!matchup || !matchup.winner_id) {
    throw new Error('Matchup not found or winner not set');
  }

  const activeBets = await models.Bet.findAll({
    where: { matchup_id: matchupId, status: BetStatus.ACTIVE },
  }) as IBetInstance[];

  const grouped = new Map<string, IBetInstance[]>();
  for (const bet of activeBets) {
    if (bet.group_id) {
      if (!grouped.has(bet.group_id)) grouped.set(bet.group_id, []);
      grouped.get(bet.group_id)!.push(bet);
    }
  }

  const results: IPayoutInstance[] = [];

  for (const [group_id, groupBets] of grouped.entries()) {
    const winners = groupBets.filter(b => b.pick === matchup.winner_id);
    const losers = groupBets.filter(b => b.pick !== matchup.winner_id);

    if (winners.length === 0) continue;

    const totalLosingStake = losers.reduce((sum, b) => sum + b.amount, 0);
    const payoutPerWinner = totalLosingStake / winners.length;

    for (const bet of winners) {
      await models.Bet.update({ status: BetStatus.WON }, { where: { id: bet.id } });
      await adjustUserBalance(bet.user_id, payoutPerWinner, models);

      const payout = await models.Payout.create({
        user_id: bet.user_id,
        matchup_id: matchupId,
        bet_id: bet.id,
        amount: payoutPerWinner,
        status: PayoutStatus.WON,
        created_at: new Date(),
        group_id,
      });

      results.push(payout);
    }

    for (const bet of losers) {
      await models.Bet.update({ status: BetStatus.LOST }, { where: { id: bet.id } });

      const payout = await models.Payout.create({
        user_id: bet.user_id,
        matchup_id: matchupId,
        bet_id: bet.id,
        amount: 0,
        status: PayoutStatus.LOST,
        created_at: new Date(),
      });

      results.push(payout);
    }
  }

  return { matchup, results };
};
