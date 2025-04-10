// server/src/models/payout.ts
import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

export interface IPayoutAttributes {
  id?: number;
  bet_id: number;
  user_id: number;
  matchup_id: number;    
  amount: number;
  status: 'won' | 'lost';
  created_at?: Date;
  group_id?: string;     
}

export interface IPayoutCreationAttributes extends Optional<IPayoutAttributes, 'id' | 'created_at'> {}

export interface IPayoutInstance extends Model<IPayoutAttributes, IPayoutCreationAttributes>, IPayoutAttributes {}

export const PayoutFactory = (sequelize: Sequelize) => {
  const Payout = sequelize.define<IPayoutInstance>('Payout', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bet_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    matchup_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['won', 'lost']],
      },
    },
    group_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
  }, {
    tableName: 'payouts',
    timestamps: false,
  });

  return Payout;
};
