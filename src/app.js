import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cookieParser from 'cookie-parser';
import db from './db/connection.js';
import router from './routes/router.js';
import Logger from './utils/logger/logger.js';
import sequelize from './db/orm.js';
import './models/associations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = new Logger();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', router);

app.use((req, res, next) => {
  return res.status(404).render('404');
  // res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  logger.error({ err });
  // ONLY FOR TEST ROLLBACK
  if (err.message === 'Prohibited content') {
    return res.status(400).json({ message: err.message });
  }
  //
  return res.status(500).render('error', { message: 'Internal server error' });
});

const server = app.listen(process.env.APP_PORT || 3000, () => {
  logger.info(`Express server is listening on port ${process.env.APP_PORT}`);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT');
  await db.end();
  server.close(async () => {
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM');
  await db.end();
  server.close(async () => {
    process.exit(0);
  });
});
