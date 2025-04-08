// server/src/models/index.ts
import { Sequelize } from 'sequelize';
import { UserFactory } from './user.js';
import { LeagueFactory } from './league.js';
import { BuyInFactory } from './buyin.js';
import { MatchupFactory } from './matchup.js';
import { BetFactory } from './bet.js';

export function initModels(sequelize: Sequelize) {
  const User = UserFactory(sequelize);
  const League = LeagueFactory(sequelize);
  const BuyIn = BuyInFactory(sequelize);
  const Matchup = MatchupFactory(sequelize);
  const Bet = BetFactory(sequelize);

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

  return {
    User,
    League,
    BuyIn,
    Matchup,
    Bet
  };
}
