import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import autoLoad from "@fastify/autoload";
import Fastify from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { AppError, BusinessCode } from "@/common/app-error";
import { formatLogTime } from "@/utils";
import { env } from "@/config/env";
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError } from "fastify-type-provider-zod";

const currentFilePath = fileURLToPath(import.meta.url);
const rootDir = path.dirname(currentFilePath);
const pluginsDir = path.join(rootDir, "plugins");
const modulesDir = path.join(path.dirname(currentFilePath), "modules");

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: "info",
      base: undefined,
      formatters: {
        level(label) {
          return { level: label };
        },
      },
      timestamp: () => `,"time":"${formatLogTime()}"`,
      redact: {
        paths: ["req.headers.authorization", "req.headers.cookie", "headers.authorization", "headers.cookie", "body.password"],
        remove: false,
      },
      transport: {
        target: path.join(process.cwd(), "access-log-transport.mjs"),
        options: {
          logDir: env.LOG_DIR,
        },
      },
    },
    disableRequestLogging: true,
    genReqId: () => randomUUID(),
  });
  app.withTypeProvider<ZodTypeProvider>();
  registerCommon(app);
  await app.register(autoLoad, {
    dir: pluginsDir,
    scriptPattern: /.*\.(js|ts)$/,
  });
  await app.register(autoLoad, {
    dir: modulesDir,
    dirNameRoutePrefix: false,
    scriptPattern: /.*\.route\.(js|ts)$/,
  });
  return app;
}

function registerCommon(app: FastifyInstance) {
  app.addHook("onRequest", async (request, reply) => {
    reply.header("x-request-id", request.id);
  });
  app.decorateReply("success", function success<T>(this: FastifyReply, data: T, message = "success", code = BusinessCode.SUCCESS) {
    return this.send({ code, message, data, requestId: this.request.id });
  });

  app.decorateReply("errors", function errors(this: FastifyReply, message = "error", code = BusinessCode.INTERNAL_ERROR) {
    return this.send({ code, message, data: null, requestId: this.request.id });
  });

  app.setNotFoundHandler((request, reply) => {
    return reply.errors(`接口不存在: ${request.method} ${request.url}`, BusinessCode.NOT_FOUND);
  });

  app.setErrorHandler((error, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.errors(formatValidationErrorMessage(error.validation), BusinessCode.PARAM_ERROR);
    }

    if (isResponseSerializationError(error)) {
      request.log.error({ error, cause: error.cause }, "响应数据不符合接口文档定义");
      return reply.errors(error.message, BusinessCode.RESPONSE_FORMAT_ERROR);
    }

    if (error instanceof AppError) {
      return reply.errors(error.message, error.code);
    }

    request.log.error({ error }, "请求处理异常");
    return reply.errors("服务器内部错误", BusinessCode.INTERNAL_ERROR);
  });
}

function formatValidationErrorMessage(validation: Array<{ instancePath?: string; message?: string }>) {
  const details = validation
    .map((item) => {
      const path = item.instancePath || "/";
      const message = item.message || "参数格式不正确";
      return `${path} ${message}`;
    })
    .join("; ");

  return details ? `请求参数错误: ${details}` : "请求参数错误";
}
