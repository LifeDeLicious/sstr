import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { migrate } from "drizzle-orm/mysql2/migrator";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const db = drizzle(
    await mysql.createConnection(process.env.DATABASE_URL_MIGRATIONS)
  );

  console.log("Running migrations...");

  await migrate(db, {
    migrationsFolder: "./drizzle",
  });

  console.log("Migrations complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
