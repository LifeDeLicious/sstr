import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default {
  schema: "./db/schema.js",
  connectionString: "env:DATABASE_URL",
  out: "./drizzle",
  driver: "mysql2",
  dialect: "mysql",
};

//!drizzle-kit studio attempt
// export defineConfig({
//   connectionString: "env:DATABASE_URL",
// //   dbCredentials: {
// //     host: "",
// //   }
// })
