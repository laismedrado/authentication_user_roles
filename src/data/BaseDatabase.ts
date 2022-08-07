import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

export class BaseDatabase {
  protected static connection = knex({
    client: "postgres",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_SCHEMA,
      port: 5432,
      multipleStatements: true,
    },
  });
}
