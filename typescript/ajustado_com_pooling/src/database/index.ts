import { Pool } from "pg";

export const db = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 10,
  min: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

db.connect().then((c) => console.log("Conectado no Banco de Dados"));
