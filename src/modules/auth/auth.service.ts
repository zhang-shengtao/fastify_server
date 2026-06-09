import type { FastifyBaseLogger } from "fastify";

interface Options {
  logger: FastifyBaseLogger;
  userJwtSign: FastifyInstance["jwt"]["sign"];
  db: FastifyInstance["db"];
  redis: FastifyInstance["redis"];
}

export default class AuthService {
  constructor(private readonly options: Options) {}
  async login(username: string, password: string) {}
}
