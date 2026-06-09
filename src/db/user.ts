import { int, timestamp, varchar, mysqlTable } from "drizzle-orm/mysql-core";

// 所有的接口权限表
export const admin_user = mysqlTable("user", {
  user_id: int("permissions_id").autoincrement().primaryKey(), // 新增：自增主键 ID
  account: varchar("name", { length: 50 }).notNull().unique(), // 用户账号
  nickname: varchar("nickname", { length: 50 }).notNull(), // 用户昵称
  passwordHash: varchar("password_hash", { length: 255 }).notNull(), // 登录密码哈希
  status: varchar("status", { length: 20 }).notNull().default("normal"), // 状态：normal(启用) / disabled(禁用) / deleted(删除)
  reamk: varchar("remark", { length: 255 }), // 备注
  created_at: timestamp("created_at").defaultNow().notNull(), // 创建时间
  updated_at: timestamp("updated_at").defaultNow().notNull(), // 更新时间
  deleted_at: timestamp("deleted_at"), // 软删除时间
});

export type PermissionsType = typeof admin_user.$inferSelect;
