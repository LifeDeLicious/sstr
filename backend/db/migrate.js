import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { migrate } from "drizzle-orm/mysql2/migrator";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const db = drizzle(
    await mysql.createConnection(
      process.env.DATABASE_URL_MIGRATIONS
      //     {
      //   host: process.env.DATABASE_HOST,
      //   user: process.env.DATABASE_USER,
      //   password: process.env.DATABASE_PASSWORD,
      //   database: process.env.DATABASE_NAME,
      // }
    )
  );

  console.log("Running migrations...");

  //   const migrationsFolderPath = `${process.cwd}/drizzle`; // Or "../drizzle", try both
  //   console.log(
  //     "Attempting to run migrations from folder:",
  //     migrationsFolderPath
  //   );

  await migrate(db, {
    migrationsFolder: "./drizzle",
  }); // Assuming your migration files are in a 'drizzle' folder

  console.log("Migrations complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
