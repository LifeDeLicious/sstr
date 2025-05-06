import {
  mysqlTable,
  varchar,
  int,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";

export const Analysis = mysqlTable("Analysis", {
  AnalysisID: int("AnalysisID").primaryKey().autoincrement(),
  AnalysisName: varchar("AnalysisName", { length: 255 }).notNull(),
  IsAnalysisPublic: boolean("IsAnalysisPublic").default(false).notNull(),
  AnalysisDate: timestamp("AnalysisDate").defaultNow(),
});
