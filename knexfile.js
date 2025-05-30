import path from 'node:path';
import 'dotenv/config';
import dbConfig from './src/config/db.js';

export default {
  client: 'pg',
  connection: dbConfig,
  migrations: {
    directory: path.join('src', 'db', 'migrations'),
    tableName: 'migrations',
    stub: path.join('.', 'src', 'db', 'migration.stub.js'),
  },
};
