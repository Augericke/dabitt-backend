import "dotenv/config";

const SERVER = {
  hostname: process.env.SERVER_HOSTNAME || "localhost",
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
