import { mysqlTable, int } from "drizzle-orm/mysql-core";
import { Laps } from "./Laps.js";
import { Analysis } from "./Analysis.js";

export const AnalysisLaps = mysqlTable("AnalysisLaps", {
  ID: int("ID").primaryKey().autoincrement().notNull(),
  AnalysisID: int("AnalysisID").references(() => Analysis.AnalysisID),
  LapID: int("LapID").references(() => Laps.LapID),
  //!LapID: bigint("LapID", { mode: "number" }).references(() => Laps.LapID),
  //!todo apla kraasa analiizee??
});
