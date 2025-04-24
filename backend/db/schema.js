import { orders } from "./schema/orders.js";
import { users } from "./schema/users.js";

export const schema = {
  orders,
  users,
};

// export const users = mysqlTable("users", {
//   id: serial("id").primaryKey(),
//   name: varchar("name", { length: 255 }).notNull(),
// });
