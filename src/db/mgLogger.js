import path from 'node:path';
import Logger from '../utils/logger/logger.js';

const LOG_PATH = path.resolve('logs', 'miggrations.log');

const mgLogger = new Logger(LOG_PATH);

export default mgLogger;
