import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ISideBetAttributes {
  id?: number;
  description: string;
  week: number;
  winner_id?: number | null;
  amount: number;
  created_at?: Date;
}

export interface ISideBetInstance extends Model<ISideBetAttributes>, ISideBetAttributes {}

export const SideBetModel = (sequelize: Sequelize) => {
  return sequelize.define<ISideBetInstance>('SideBet', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    week: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    winner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'side_bets',
    timestamps: false,
  });
};