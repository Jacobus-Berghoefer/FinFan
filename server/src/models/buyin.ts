// server/src/models/buyin.ts
import { DataTypes, Sequelize } from 'sequelize';

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