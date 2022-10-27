import "dotenv/config";

const SERVER = {
  port: process.env.SERVER_PORT,
};

const DATABASE = {
  url: process.env.DATABASE_URL,
};

const AUTH = {
  audience: process.env.AUDIENCE,
  issuerBaseUrl: process.env.ISSUER_BASE_URL,
};

const config = {
  server: SERVER,
  database: DATABASE,
  auth: AUTH,
};

export default config;
