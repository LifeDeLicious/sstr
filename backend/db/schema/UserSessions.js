import { mysqlTable, int } from "drizzle-orm/mysql-core";
import { Sessions } from "./Sessions.js";
import { Users } from "./Users.js";

export const UserSessions = mysqlTable("UserSessions", {
  ID: int("ID").primaryKey().autoincrement().notNull(),
  SessionID: int("SessionID").references(() => Sessions.SessionID),
  UserID: int("UserID").references(() => Users.UserID),
});
