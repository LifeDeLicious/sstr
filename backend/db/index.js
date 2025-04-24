import { drizzle } from "drizzle-orm/mysql2";
//import { migrate } from "drizzle-orm/mysql-core/";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // Load env variables

// Create MySQL connection
//const connection = await mysql.createConnection(process.env.DATABASE_URL);

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

//forcing connection character set to support āīūē...
await pool.query("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;");
await pool.query("SET CHARACTER SET utf8mb4;");

const db = drizzle(pool);

export { db, pool };

//await migrate(db);
