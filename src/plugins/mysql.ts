import fp from "fastify-plugin";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { env } from "@/config/env";

async function mysqlPlugin(fastify: FastifyInstance) {
  const db = drizzle(env.MYSQL_URL);
  try {
    await db.execute(sql`SELECT 1`);
  } catch (error) {
    fastify.log.error({ tip: "链接数据库报错", error });
    process.exit(1);
  }

  fastify.decorate("db", db);
  fastify.addHook("onClose", async () => {
    await new Promise<void>((resolve, reject) => {
      db.$client.end((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  });
}

export default fp(mysqlPlugin, { name: "mysql-plugin" });
