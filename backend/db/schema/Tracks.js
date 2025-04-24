import {
  mysqlTable,
  serial,
  varchar,
  int,
  bigint,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";

export const Tracks = mysqlTable("Tracks", {
  TrackID: int("TrackID").primaryKey().autoincrement(),
  TrackName: varchar("TrackName", { length: 255 }).notNull(),
  //!tracklength
  TrackAssetName: varchar("TrackAssetName", { length: 256 }).notNull(),
  TrackImageAssetName: varchar("TrackImageAssetName", {
    length: 256,
  }),
  IsAnalysisPublic: boolean("IsAnalysisPublic").default(false).notNull(),
  AnalysisDate: timestamp("AnalysisDate").defaultNow(),
});
