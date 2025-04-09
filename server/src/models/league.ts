// server/src/models/league.ts
import { DataTypes, Sequelize, Model } from 'sequelize';
export interface ILeagueAttributes {
  id?: number;
  sleeper_league_id: string;
  league_name: string;
  season_year: string;
}

export interface ILeagueInstance extends Model<ILeagueAttributes>, ILeagueAttributes {}

export const LeagueFactory = (sequelize: Sequelize) => {
  const League = sequelize.define('League', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sleeper_league_id: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false,
    },
    league_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    season_year: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'leagues',
    timestamps: false,
  });

  return League;
};
