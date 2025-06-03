import { Sequelize } from 'sequelize';
import { getConnectionString } from '../config/db.js';

const sequelize = new Sequelize(getConnectionString(), {
  dialect: 'postgres',
  logging: false,
});

export default sequelize;
