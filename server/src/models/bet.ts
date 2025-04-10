// server/src/models/bet.ts
import { DataTypes, Sequelize, Model } from 'sequelize';

export interface IBetAttributes {
  id?: number;
  user_id: number;
  matchup_id: number;
  pick: number;
  amount: number;
  week: number;
  status?: string;
}

export interface IBetInstance extends Model<IBetAttributes>, IBetAttributes {}

export const BetFactory = (sequelize: Sequelize) => {
  const Bet = sequelize.define('Bet', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    matchup_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    pick: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    week: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'bets',
    timestamps: false,
  });

  return Bet;
};