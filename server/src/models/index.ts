// server/src/models/index.ts
import { Sequelize } from 'sequelize';
import { UserFactory } from './user.js';
import { LeagueFactory } from './league.js';
import { BuyInFactory } from './buyin.js';
import { MatchupFactory } from './matchup.js';
import { BetFactory } from './bet.js';
import { PayoutFactory } from './payout.js';
import { UserLeagueStatsModel } from './userLeagueStats.js';
import { SideBetModel } from './sidebet.js';
import { SideBetEntryModel } from './sidebetEntry.js';

export function initModels(sequelize: Sequelize) {
  const User = UserFactory(sequelize);
  const League = LeagueFactory(sequelize);
  const BuyIn = BuyInFactory(sequelize);
  const Matchup = MatchupFactory(sequelize);
  const Bet = BetFactory(sequelize);
  const Payout = PayoutFactory(sequelize);
  const UserLeagueStats = UserLeagueStatsModel(sequelize);
  const SideBet = SideBetModel(sequelize);
  const SideBetEntry = SideBetEntryModel(sequelize);

  // Associations
  User.hasMany(BuyIn, { foreignKey: 'user_id' });
  League.hasMany(BuyIn, { foreignKey: 'league_id' });
  BuyIn.belongsTo(User, { foreignKey: 'user_id' });
  BuyIn.belongsTo(League, { foreignKey: 'league_id' });

  League.hasMany(Matchup, { foreignKey: 'league_id' });
  Matchup.belongsTo(League, { foreignKey: 'league_id' });

  User.hasMany(Bet, { foreignKey: 'user_id' });
  Matchup.hasMany(Bet, { foreignKey: 'matchup_id' });
  Bet.belongsTo(User, { foreignKey: 'user_id' });
  Bet.belongsTo(Matchup, { foreignKey: 'matchup_id' });

  Payout.belongsTo(User, { foreignKey: 'user_id' });
  User.hasMany(Payout, { foreignKey: 'user_id' });

  Payout.belongsTo(Matchup, { foreignKey: 'matchup_id' });
  Matchup.hasMany(Payout, { foreignKey: 'matchup_id' });

  Payout.belongsTo(Bet, { foreignKey: 'bet_id' });
  Bet.hasOne(Payout, { foreignKey: 'bet_id' });

  User.hasMany(UserLeagueStats, { foreignKey: 'user_id' });
  League.hasMany(UserLeagueStats, { foreignKey: 'league_id' });

  UserLeagueStats.belongsTo(User, { foreignKey: 'user_id' });
  UserLeagueStats.belongsTo(League, { foreignKey: 'league_id' });

  SideBet.hasMany(SideBetEntry, { foreignKey: 'side_bet_id' });
  SideBetEntry.belongsTo(SideBet, { foreignKey: 'side_bet_id' });

  User.hasMany(SideBetEntry, { foreignKey: 'user_id' });
  SideBetEntry.belongsTo(User, { foreignKey: 'user_id' });

  return {
    User,
    League,
    BuyIn,
    Matchup,
    Bet,
    Payout,
    UserLeagueStats,
    SideBet,
    SideBetEntry,
  };
}

export type Models = ReturnType<typeof initModels>;