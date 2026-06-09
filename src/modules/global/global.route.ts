import { errorResponseSchema } from "@/utils";
import { healthResponseSchema } from "./global.schema";
import { getHealthStatus } from "./global.service";

export default async function globalRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/health/ready",
    {
      schema: {
        tags: ["健康检查"],
        summary: "服务就绪检查",
        description: "检查服务进程、Redis 和 MySQL 是否可用",
        response: {
          200: healthResponseSchema,
          500: errorResponseSchema,
        },
      },
    },
    async function (request, reply) {
      const result = await getHealthStatus(fastify);
      return reply.success(result);
    },
  );
}
