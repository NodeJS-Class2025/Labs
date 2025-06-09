import { DataTypes } from 'sequelize';
import sequelize from '../db/orm.js';

export const TopicORM = sequelize.define(
  'Topic',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false, defaultValue: 'general' },
  },
  { tableName: 'topics', timestamps: true },
);
