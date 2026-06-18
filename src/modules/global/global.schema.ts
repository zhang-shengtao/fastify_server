import { responseSchema, errorResponseSchema } from "@/utils";
import { z } from "zod/v4";

export const health_schema = {
  schema: {
    tags: ["健康检查"],
    summary: "服务就绪检查",
    description: "检查服务进程、Redis 和 MySQL 是否可用",
    response: {
      200: responseSchema(
        z.object({
          redis: z.string().describe("Redis PING 返回值"),
          mysql: z.string().describe("MySQL 状态"),
          uptime: z.number().describe("当前时间戳"),
        }),
      ),
      500: errorResponseSchema,
    },
  },
};
