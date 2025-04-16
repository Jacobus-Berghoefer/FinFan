import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  return sequelize.define("UserLeague", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    league_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: "user_leagues",
    timestamps: false,
    indexes: [
      { unique: true, fields: ["user_id", "league_id"] },
    ],
  });
};