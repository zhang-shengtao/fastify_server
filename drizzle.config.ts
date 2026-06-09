/// <reference types="node" />

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "src/db/*.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.MYSQL_URL ?? "",
  },
});
