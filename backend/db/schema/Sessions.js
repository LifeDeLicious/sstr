import {
  mysqlTable,
  varchar,
  int,
  timestamp,
  double,
} from "drizzle-orm/mysql-core";
import { Users } from "./Users.js";
import { Cars } from "./Cars.js";
import { Tracks } from "./Tracks.js";

export const Sessions = mysqlTable("Sessions", {
  SessionID: int("SessionID").primaryKey().autoincrement().notNull(),
  UserID: int("UserID").references(() => Users.UserID),
  CarID: int("CarID").references(() => Cars.CarID),
  TrackID: int("TrackID").references(() => Tracks.TrackID),
  DateTime: timestamp("DateTime").defaultNow().notNull(),
  TrackTemperature: varchar("TrackTemperature", { length: 4 }).notNull(),
  AirTemperature: varchar("AirTemperature", { length: 4 }).notNull(),
  FastestLapTime: double("FastestLapTime").notNull(),
});
