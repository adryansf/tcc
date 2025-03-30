import { Client, ClientConfig } from "pg";

const config = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
} as ClientConfig;

export const createConnection = async () => {
  try {
    const client = new Client(config);
    await client.connect();
    return client;
  } catch (err) {
    console.error("Erro:", err);
  }
};
