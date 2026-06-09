import { responseSchema } from "@/utils";
import { z } from "zod/v4";

export const healthResponseSchema = responseSchema(
  z.object({
    redis: z.string().describe("Redis PING 返回值"),
    mysql: z.string().describe("MySQL 状态"),
    uptime: z.number().describe("当前时间戳"),
  }),
);
