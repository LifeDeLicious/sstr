import {
  mysqlTable,
  serial,
  varchar,
  int,
  bigint,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";

export const AnalysisLaps = mysqlTable("AnalysisLaps", {
  ID: bigint("ID").primaryKey().autoincrement().notNull(),
  AnalysisID: bigint("AnalysisID", { mode: "number" }).references(
    () => Analysis.AnalysisID
  ),
  //!LapID: bigint("LapID", { mode: "number" }).references(() => Laps.LapID),
  //!todo apla kraasa analiizee??
});
