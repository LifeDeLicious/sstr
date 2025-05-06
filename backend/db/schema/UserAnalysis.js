import { mysqlTable, int } from "drizzle-orm/mysql-core";
import { Users } from "./Users.js";
import { Analysis } from "./Analysis.js";

export const UserAnalysis = mysqlTable("UserAnalysis", {
  ID: int("ID").primaryKey().autoincrement().notNull(),
  AnalysisID: int("AnalysisID").references(() => Analysis.AnalysisID),
  UserID: int("UserID").references(() => Users.UserID),
});
