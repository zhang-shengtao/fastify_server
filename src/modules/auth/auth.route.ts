import { login_schema, chat_schema } from "./auth.schema";
import AuthService from "./auth.service";

export default async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify);
  fastify.post("/admin/auth/login", { ...login_schema }, async function (request, reply) {
    const body = request.body;
    const token = await authService.login(body.username, body.password);
    reply.success({ token });
  });

  fastify.post("/api/msg/chat", { ...chat_schema }, async function (request, reply) {
    const body = request.body;
    reply.raw.writeHead(200, {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
      "request-id": request.id,
    });
    authService.chat(body.name, reply);
  });

  fastify.get("/api/msg/ws", { websocket: true }, function (socket, req) {
    socket.on("message", async (message) => {
      console.log("message=>", typeof message.toString());
    });
    socket.on("close", (e) => {
      console.log("close=>", e);
    });
  });
}
