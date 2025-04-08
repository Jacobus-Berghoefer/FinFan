// server/src/models/user.ts
import { DataTypes, Sequelize } from 'sequelize';

export const UserFactory = (sequelize: Sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sleeper_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'users',
    timestamps: false,
  });

  return User;
};
