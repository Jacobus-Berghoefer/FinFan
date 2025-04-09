// server/src/models/matchup.ts
import { DataTypes, Sequelize } from 'sequelize';

export const MatchupFactory = (sequelize: Sequelize) => {
  const Matchup = sequelize.define('Matchup', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    league_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    week: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    team1_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    team2_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    winner_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'matchups',
    timestamps: false,
  });

  return Matchup;
};