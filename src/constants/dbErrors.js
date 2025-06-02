import pg from 'pg';

const DB_ERRORS = {
  UNIQUE_CONSTRAINT: '23505',
  FOREIGN_KEY_CONSTRAINT: '23503',
  DATABASE_ERROR: pg.DatabaseError,
};

export const checkDBError = (err, type) => {
  if (!err || !(err instanceof Error)) return false;

  if (typeof type === 'string') {
    return err.code === type;
  }

  return err instanceof type;
};

export default DB_ERRORS;
