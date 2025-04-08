
// server/src/models/league.ts
import { DataTypes, Sequelize } from 'sequelize';

export const LeagueFactory = (sequelize: Sequelize) => {
  const League = sequelize.define('League', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sleeper_league_id: {
      type: DataTypes.STRING,
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
