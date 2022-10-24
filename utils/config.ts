import "dotenv/config";

const SERVER = {
  port: process.env.SERVER_PORT,
};

const DATABASE = {
  url: process.env.DATABASE_URL,
};

const config = {
  server: SERVER,
  database: DATABASE,
};

export default config;
