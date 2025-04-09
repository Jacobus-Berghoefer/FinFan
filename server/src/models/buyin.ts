// server/src/models/buyin.ts
import { DataTypes, Sequelize, Model } from 'sequelize';
export interface IBuyInAttributes {
  id?: number;
  user_id: number;
  league_id: number;
  season: string;
  paid: boolean;
}

export interface IBuyInInstance extends Model<IBuyInAttributes>, IBuyInAttributes {}

export const BuyInFactory = (sequelize: Sequelize) => {
  const BuyIn = sequelize.define('BuyIn', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    league_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    season: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'buyins',
    timestamps: false,
  });

  return BuyIn;
};