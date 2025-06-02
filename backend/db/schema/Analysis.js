import {
  mysqlTable,
  varchar,
  int,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";
import { Tracks } from "./Tracks.js";
import { Cars } from "./Cars.js";

export const Analysis = mysqlTable("Analysis", {
  AnalysisID: int("AnalysisID").primaryKey().autoincrement(),
  AnalysisName: varchar("AnalysisName", { length: 255 }),
  TrackID: int("TrackID").references(() => Tracks.TrackID),
  CarID: int("CarID").references(() => Cars.CarID),
  IsAnalysisPublic: boolean("IsAnalysisPublic").default(true).notNull(),
  AnalysisDate: timestamp("AnalysisDate").defaultNow(),
});
