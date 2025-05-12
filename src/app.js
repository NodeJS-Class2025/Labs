import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import router from './routes/router.js';
import Logger from './utils/logger/logger.js';

const __dirname = fileURLToPath(import.meta.url);
const __filename = path.dirname(__dirname);

const app = express();

const logger = new Logger();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use('/', router);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(process.env.APP_PORT || 3000, () => {
  logger.info(`Express server is listening on port ${process.env.APP_PORT}`);
});
