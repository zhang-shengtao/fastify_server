import { login_schema, chat_schema } from "./auth.schema";
import AuthService from "./auth.service";

export default async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify);
  fastify.post("/admin/auth/login", { schema: login_schema }, async function (request, reply) {
    const body = request.body;
    const token = await authService.login(body.username, body.password);
    return reply.success({ token });
  });

  fastify.post("/api/msg/chat", { schema: chat_schema, sse: true }, async function (request, reply) {});
}
