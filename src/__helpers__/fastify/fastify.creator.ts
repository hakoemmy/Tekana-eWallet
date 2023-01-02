import { FastifyAdapter } from '@nestjs/platform-fastify';
import fastify, { FastifyReply, FastifyRequest } from 'fastify';

type FastifyAdditionalParameters = {
  setHeader: Function;
  end: Function;
};

export type CircularFastifyRequest = FastifyRequest & {
  res: FastifyReply;
};

export function createFastify(logger): FastifyAdapter {
  const fastifyInstance = fastify({ logger });
  fastifyInstance.addHook(
    'onRequest',
    (
      request: FastifyRequest & CircularFastifyRequest,
      reply: FastifyReply & FastifyAdditionalParameters,
      done,
    ) => {
      reply.setHeader = (key: string, value: any) => {
        return reply.raw.setHeader(key, value);
      };

      reply.end = () => {
        reply.send();
      };

      request.res = reply;
      done();
    },
  );

  return new FastifyAdapter(fastifyInstance);
}
