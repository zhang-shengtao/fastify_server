import { health_schema } from "./global.schema";
import GlobalService from "./global.service";

export default async function globalRoutes(fastify: FastifyInstance) {
  const globalService = new GlobalService(fastify);
  fastify.get("/health/ready", { ...health_schema }, async function (request, reply) {
    return reply.success(await globalService.health());
  });
}
