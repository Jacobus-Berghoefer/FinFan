// server/src/models/index.ts
import { Sequelize } from 'sequelize';
import { UserFactory } from './user.js';
import { LeagueFactory } from './league.js';
import { BuyInFactory } from './buyin.js';
import { MatchupFactory } from './matchup.js';
import { BetFactory } from './bet.js';
import { PayoutFactory } from './payout.js';

export function initModels(sequelize: Sequelize) {
  const User = UserFactory(sequelize);
  const League = LeagueFactory(sequelize);
  const BuyIn = BuyInFactory(sequelize);
  const Matchup = MatchupFactory(sequelize);
  const Bet = BetFactory(sequelize);
  const Payout = PayoutFactory(sequelize);

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

  return {
    User,
    League,
    BuyIn,
    Matchup,
    Bet,
    Payout,
  };
}

export type Models = ReturnType<typeof initModels>;