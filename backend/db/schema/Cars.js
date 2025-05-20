import { mysqlTable, varchar, int } from "drizzle-orm/mysql-core";

export const Cars = mysqlTable("Cars", {
  CarID: int("CarID").primaryKey().autoincrement().notNull(),
  CarModel: varchar("CarModel", { length: 128 }),
  CarAssetName: varchar("CarAssetName", { length: 128 }).notNull(),
});
