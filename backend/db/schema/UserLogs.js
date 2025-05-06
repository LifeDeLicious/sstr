import { mysqlTable, varchar, int, timestamp } from "drizzle-orm/mysql-core";
import { Users } from "./Users.js";

export const Analysis = mysqlTable("Analysis", {
  UserID: int("UserID").references(() => Users.UserID),
  EventType: varchar("EventType", { length: 50 }).notNull(),
  EventTimestamp: timestamp("AnalysisDate").defaultNow(),
});
