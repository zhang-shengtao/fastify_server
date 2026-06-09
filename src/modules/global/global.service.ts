import { sql } from "drizzle-orm";

export async function getHealthStatus(fastify: Pick<FastifyInstance, "redis" | "db">) {
  const redisStatus = await fastify.redis.ping();
  await fastify.db.execute(sql`SELECT 1`);

  return {
    redis: redisStatus,
    mysql: "ok",
    uptime: Date.now(),
  };
}
