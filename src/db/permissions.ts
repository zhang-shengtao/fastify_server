import { int, timestamp, varchar, boolean, mysqlTable, mysqlEnum } from "drizzle-orm/mysql-core";
import { admin_user } from "./admin_user";
import { admin_menus } from "./admin_menus";

// 所有的接口权限表
export const permissions = mysqlTable("permissions", {
  user_id: int("user_id")
    .references(() => admin_user.user_id)
    .notNull()
    .primaryKey(),
  admin_menus_id: int("admin_menus_id")
    .references(() => admin_menus.admin_menus_id)
    .notNull(),
  is_transmit: boolean("is_transmit").default(false).notNull(), // 是否可以给子级账户使用这个权限 false:不支持 true:支持
  is_disabled: boolean("is_disabled").default(false).notNull(), // 是否禁用 false:未禁用 true:禁用
  updated_by: int("updated_by").notNull(), // 修改人
  created_by: int("created_by").notNull(), // 创建人
  created_at: timestamp("created_at").defaultNow().notNull(), // 创建时间
  updated_at: timestamp("updated_at").defaultNow().notNull(), // 更新时间
});

export type PermissionsType = typeof permissions.$inferSelect;
