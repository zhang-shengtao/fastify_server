/// <reference types="node" />

import { defineConfig } from "drizzle-kit";
// 同步数据库表结构
export default defineConfig({
  schema: "src/db/*.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.MYSQL_URL ?? "",
  },
});
