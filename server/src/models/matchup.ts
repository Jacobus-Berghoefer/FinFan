// server/src/models/matchup.ts
import { DataTypes, Sequelize, Model } from 'sequelize';

export interface IMatchupAttributes {
  id?: number;
  league_id: number;
  week: number;
  team1_id: number;
  team2_id: number;
  winner_id?: number | null;
}

export interface IMatchupInstance extends Model<IMatchupAttributes>, IMatchupAttributes {}

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