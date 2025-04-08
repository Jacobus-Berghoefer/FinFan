// server/src/models/user.ts
import { DataTypes } from 'sequelize';
import type { Sequelize } from 'sequelize';

export const UserFactory = (sequelize: Sequelize) => {
  const User = sequelize.define('User', {
    sleeperId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  });

  return User;
};
