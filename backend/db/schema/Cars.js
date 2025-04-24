import {
  mysqlTable,
  varchar,
  int,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";

export const Cars = mysqlTable("Cars", {
  CarID: int("CarID").primaryKey().autoincrement().notNull(),
  CarModel: varchar("CarModel", { length: 128 }).notNull(),
  CarManufacturer: varchar("CarManufacturer", { length: 64 }).notNull(),
  CarAssetName: varchar("CarAssetName", { length: 128 }).notNull(),
});
