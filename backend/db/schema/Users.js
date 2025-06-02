import {
  mysqlTable,
  varchar,
  int,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";

export const Users = mysqlTable("Users", {
  UserID: int("UserID").primaryKey().autoincrement(),
  Username: varchar("Username", { length: 128 }).notNull(),
  Email: varchar("Email", { length: 128 }).notNull(),
  PasswordHash: varchar("PasswordHash", { length: 255 }).notNull(),
  DateRegistered: timestamp("DateRegistered").defaultNow().notNull(),
  IsAdmin: boolean("IsAdmin").default(false).notNull(),
});
