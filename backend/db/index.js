import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

await pool.query("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;");
await pool.query("SET CHARACTER SET utf8mb4;");

const db = drizzle(pool);

export { db, pool };
