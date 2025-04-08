// server/src/models/index.ts
import type { Sequelize } from 'sequelize';
import { UserFactory } from './user';

export const initModels = (sequelize: Sequelize) => {
  const User = UserFactory(sequelize);

  // If you have other models:
  // const BuyIn = BuyInFactory(sequelize);
  // const League = LeagueFactory(sequelize);

  return {
    User,
    // BuyIn,
    // League
  };
};
