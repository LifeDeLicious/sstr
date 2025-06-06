import { mysqlTable, int, varchar, boolean } from "drizzle-orm/mysql-core";
import { Laps } from "./Laps.js";
import { Analysis } from "./Analysis.js";

export const AnalysisLaps = mysqlTable("AnalysisLaps", {
  ID: int("ID").primaryKey().autoincrement().notNull(),
  AnalysisID: int("AnalysisID").references(() => Analysis.AnalysisID, {
    onDelete: "cascade",
  }),
  LapID: int("LapID").references(() => Laps.LapID, {
    onDelete: "cascade",
  }),
  LapColor: varchar("LapColor", { length: 7 }).default("#CCCCCC"),
  LapIsVisible: boolean("LapIsVisible").default(true).notNull(),
});
