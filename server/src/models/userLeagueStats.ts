import { DataTypes, Model, Sequelize } from 'sequelize';

export interface IUserLeagueStatsAttributes {
  id?: number;
  user_id: number;
  league_id: number;
  current_streak?: number;
  streak_direction?: 'win' | 'loss' | 'neutral';
  created_at?: Date;
  updated_at?: Date;
}

export interface IUserLeagueStatsInstance extends Model<IUserLeagueStatsAttributes>, IUserLeagueStatsAttributes {}

export const UserLeagueStatsModel = (sequelize: Sequelize) => {
  return sequelize.define<IUserLeagueStatsInstance>('UserLeagueStats', {
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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    current_streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    streak_direction: {
      type: DataTypes.ENUM('win', 'loss', 'neutral'),
      defaultValue: 'neutral',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'user_league_stats',
    timestamps: false,
  });
};
