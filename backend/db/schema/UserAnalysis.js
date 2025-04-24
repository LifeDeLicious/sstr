import {
  mysqlTable,
  serial,
  varchar,
  int,
  bigint,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";
import { Users } from "./users";

export const UserAnalysis = mysqlTable("UserAnalysis", {
  ID: int("ID").primaryKey().autoincrement().notNull(),
  AnalysisID: int("AnalysisID").references(() => Analysis.AnalysisID),
  UserID: int("UserID").references(() => Users.UserID),
});
