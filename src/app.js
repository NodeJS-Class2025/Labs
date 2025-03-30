import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { initMockData } from './mock/index.js';
import router from './routes/router.js';
import Logger from './utils/logger/logger.js';
import { readData, writeData } from './repositories/index.js';

import sleep from './utils/sleep.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = new Logger();

await initMockData();
await readData();

const app = express();

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

// process.on('SIGINT', async () => {
//   // await writeData();
//   // await sleep(0);
//   process.exit(0);
// });

// process.on('SIGTERM', async () => {
//   console.log('some SIGTERM');
//   await writeData();
//   process.exit(0);
// });

// process.on('uncaughtException', async (err) => {
//   console.error('Uncaught Exception:', err);
//   await writeData();
//   process.exit(1);
// });

// process.on('unhandledRejection', async (err) => {
//   console.error('Unhandled Rejection:', err);
//   await writeData();
//   process.exit(1);
// });
