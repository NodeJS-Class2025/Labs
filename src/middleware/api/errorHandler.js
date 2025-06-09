import { HttpError } from '../../utils/httpErrors.js';
import Logger from '../../utils/logger/logger.js';

const logger = new Logger();

export const apiErrorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  logger.error({ err });
  return res.status(500).json({ message: 'Internal server error' });
};
