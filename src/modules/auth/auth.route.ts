import { login_schema, chat_schema } from "./auth.schema";
import type { ChatData } from "./auth.schema";
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

  fastify.get("/api/msg/ws", { websocket: true, config: { is_auth: false } }, function (socket, req) {
    socket.send(JSON.stringify({ type: "open", id: req.id }));
    socket.on("message", async (message: Buffer) => {
      const msg: ChatData = JSON.parse(message.toString());
      socket.send(JSON.stringify({ ...msg, id: req.id }));
      if (msg.type === "chat") {
        socket.close();
      }
    });
    socket.on("close", () => {
      console.log("close=>", "断开了");
    });
  });
}
