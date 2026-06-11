import fp from "fastify-plugin";

// 请求响应日志记录器
async function logger(fastify: FastifyInstance) {
  fastify.addHook("preHandler", (req, reply, done) => {
    if (req.url.startsWith("/docs")) return done();
    fastify.log.info({
      method: req.method,
      url: req.url,
      uid: req.id,
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers,
    });
    done();
  });
  fastify.addHook("onSend", (req, reply, payload, done) => {
    if (req.url.startsWith("/docs")) return done();
    fastify.log.info({
      method: req.method,
      url: req.url,
      uid: req.id,
      statusCode: reply.statusCode,
      headers: reply.getHeaders(),
      payload: payload,
    });
    done();
  });
}

export default fp(logger, {
  name: "req_logger_res_plugin",
});
