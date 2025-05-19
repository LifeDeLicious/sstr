import {
  mysqlTable,
  varchar,
  int,
  double,
  boolean,
} from "drizzle-orm/mysql-core";
import { Users } from "./Users.js";
import { Sessions } from "./Sessions.js";

export const Laps = mysqlTable("Laps", {
  LapID: int("LapID").primaryKey().autoincrement().notNull(),
  UserID: int("UserID").references(() => Users.UserID),
  LapFileKey: varchar("LapFileKey", { length: 255 }),
  LapTime: double("LapTime").notNull(),
  SessionID: int("SessionID").references(() => Sessions.SessionID),
  IsFastestLapOfSession: boolean("IsFastestLapOfSession"),
});
