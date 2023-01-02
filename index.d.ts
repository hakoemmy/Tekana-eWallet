import { User } from "@prisma/client";

export type UserPayload = User & {
  tokenId?: number;
};

declare module "fastify" {
  export interface FastifyRequest {
    user?: UserPayload;
    cookies: { [key: string]: string };
  }
}
