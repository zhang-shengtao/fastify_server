import { int, timestamp, varchar, boolean, mysqlTable } from "drizzle-orm/mysql-core";

// 所有的接口权限表
export const permissions = mysqlTable("permissions", {
  permissions_id: int("permissions_id").autoincrement().primaryKey(), // 新增：自增主键 ID
  code: varchar("code", { length: 120 }).notNull().unique(), // 修改：必填且唯一，移除主键约束
  scope: varchar("scope", { length: 120 }).notNull(), // 父级权限编码，用于权限分组
  name: varchar("name", { length: 120 }).notNull(), // 权限名称
  status: varchar("status", { length: 20 }).notNull().default("normal"), // 状态：normal(启用) / disabled(禁用) / deleted(删除)
  description: varchar("description", { length: 255 }), // 权限描述
  is_bind: boolean("is_bind").notNull().default(false), // 是否绑定了权限点
  bind_id: int("bind_id").default(0), // 绑定的权限点ID
  created_at: timestamp("created_at").defaultNow().notNull(), // 创建时间
  updated_at: timestamp("updated_at").defaultNow().notNull(), // 更新时间
  deleted_at: timestamp("deleted_at"), // 软删除时间
});

export type PermissionsType = typeof permissions.$inferSelect;
