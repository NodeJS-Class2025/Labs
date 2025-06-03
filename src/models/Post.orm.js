import { DataTypes } from 'sequelize';
import sequelize from '../db/orm.js';

export const PostORM = sequelize.define(
  'Post',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    topicId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { tableName: 'posts', timestamps: true },
);
