import { mysqlTable, varchar, int, timestamp } from "drizzle-orm/mysql-core";
import { Users } from "./Users.js";

export const UserLogs = mysqlTable("UserLogs", {
  UserID: int("UserID").references(() => Users.UserID, {
    onDelete: "set null",
  }),
  EventType: varchar("EventType", { length: 50 }).notNull(),
  EventTimestamp: timestamp("AnalysisDate").defaultNow(),
});
