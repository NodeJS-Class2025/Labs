import pg, { Pool } from 'pg';
import dbConfig from '../config/db.js';
import Logger from '../utils/logger/logger.js';

const logger = new Logger();

pg.types.setTypeParser(1082, val => val)

const db = new Pool({
  ...dbConfig,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 3_000,
});

try{
  await db.query('SELECT 1');
  logger.info('Connection has been established successfully.');
} catch(err){
  logger.error({ err, msg: 'Database connection failed' });
  process.exit(1);
}

export default db;