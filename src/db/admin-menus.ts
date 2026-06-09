import { boolean, int, json, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

// 管理后台菜单、页面、按钮表
export const adminMenus = mysqlTable("admin_menus", {
  admin_menus_id: int("admin_menus_id").autoincrement().primaryKey(), // 新增：物理主键，稳定关联
  name: varchar("name", { length: 100 }).notNull().unique(), // 路由名称/组件名，唯一，用于前端匹配
  parentId: int("parent_id").default(0), // 修改：父级ID，0表示根节点，比parentName更稳定
  path: varchar("path", { length: 200 }).notNull(), // 前端路由路径
  component: varchar("component", { length: 200 }), // 前端组件路径
  redirect: varchar("redirect", { length: 200 }), // 重定向路径
  title: varchar("title", { length: 100 }).notNull(), // 菜单标题
  icon: varchar("icon", { length: 100 }), // 菜单图标
  type: varchar("type", { length: 30 }).notNull().default("menu"), // 类型：directory(目录) / menu(菜单) / button(按钮)
  // 权限绑定：建议存储 JSON 数组 ["perm_code_1", "perm_code_2"] 或单个 code
  // 如果是一对多关系强烈建议拆分为中间表，这里暂保留字段以简化结构
  permissionCodes: varchar("permission_codes", { length: 500 }), // 绑定的权限code列表，逗号分隔或JSON
  sort: int("sort").notNull().default(0), // 排序值
  hidden: boolean("hidden").notNull().default(false), // 是否隐藏
  keepAlive: boolean("keep_alive").notNull().default(false), // 页面是否缓存
  isActive: boolean("is_active").notNull().default(true), // 启用开关
  status: varchar("status", { length: 20 }).notNull().default("normal"), // 状态
  // 扩展元数据，存储前端需要的其他非标准字段
  meta: json("meta"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"), // 软删除
});
