import fp from "fastify-plugin";
import fastifyFormbody from "@fastify/formbody";

async function multipartPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyFormbody, {
    bodyLimit: 3000,
    // parser?: (str: string) => Record<string, unknown>
  });
}

export default fp(multipartPlugin, {
  name: "fastify-formbody-plugin",
});
