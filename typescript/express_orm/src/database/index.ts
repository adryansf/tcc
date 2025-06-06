import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "postgres",
  logging: false,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  define: {
    timestamps: true,
  },
  pool: {
    max: 100,
    min: 100,
  },
});

export { sequelize };
