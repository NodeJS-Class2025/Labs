const dbConfig = {
  host: process.env.DB_HOSTNAME,
  port: +process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export const getConnectionString = () => {
  return `postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
};

export default dbConfig;
