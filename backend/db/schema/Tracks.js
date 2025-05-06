import { mysqlTable, varchar, int } from "drizzle-orm/mysql-core";

export const Tracks = mysqlTable("Tracks", {
  TrackID: int("TrackID").primaryKey().autoincrement(),
  TrackName: varchar("TrackName", { length: 255 }),
  TrackLayout: varchar("TrackLayout", { length: 255 }).notNull(),
  //!tracklength
  TrackAssetName: varchar("TrackAssetName", { length: 256 }).notNull(),
  TrackImageAssetName: varchar("TrackImageAssetName", {
    length: 256,
  }),
});
