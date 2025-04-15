// server/src/models/user.ts
import { DataTypes, Sequelize } from 'sequelize';
import type { Model, Optional } from 'sequelize';

export interface IUserAttributes {
  id: number;
  sleeper_id: string;
  display_name: string;
  avatar?: string | null;
  balance: number;
  password: string;
  sleeper_linked: boolean;
  username: string;
  sleeper_display_name?: string | null;
}

export interface IUserCreationAttributes extends Optional<IUserAttributes, 'id'> {}

export interface IUserInstance extends Model<IUserAttributes, IUserCreationAttributes>, IUserAttributes {}

export const UserFactory = (sequelize: Sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sleeper_id: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: true,
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1000, // 0 in production
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sleeper_linked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    sleeper_display_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'users',
    timestamps: false,
  });

  return User;
};
