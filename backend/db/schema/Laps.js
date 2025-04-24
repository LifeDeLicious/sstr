import {
  mysqlTable,
  varchar,
  int,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";

export const Laps = mysqlTable("Laps", {
  LapID: int("LapID").primaryKey().autoincrement().notNull(),
  UserID: int("UserID").references(() => Users.UserID),
  LapFileName: varchar("LapFileName", { length: 255 }).notNull(),
  LapTime: varchar("LapTime", { length: 16 }).notNull(),
  SessionID: int("SessionID").references(() => SessionsCollapse.SessionID),
});
