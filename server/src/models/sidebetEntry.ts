import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ISideBetEntryAttributes {
  id?: number;
  user_id: number;
  side_bet_id: number;
  player_name: string;
  player_position: string;
  score: number;
  amount: number;
  status?: 'joined' | 'won' | 'lost';
  created_at?: Date;
}

export interface ISideBetEntryInstance extends Model<ISideBetEntryAttributes>, ISideBetEntryAttributes {}

export const SideBetEntryModel = (sequelize: Sequelize) => {
  return sequelize.define<ISideBetEntryInstance>('SideBetEntry', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    side_bet_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    player_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    player_position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('joined', 'won', 'lost'),
      defaultValue: 'joined',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
  }, {
    tableName: 'side_bet_entries',
    timestamps: false,
  });
};