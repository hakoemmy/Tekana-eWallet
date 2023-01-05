import {
    FastifyCorsOptionsDelegate,
    FastifyPluginOptionsDelegate,
  } from '@fastify/cors';
  import { NODE_ENV } from '../__helpers__';
  
  export const fastifyCorsCallback: FastifyPluginOptionsDelegate<
    FastifyCorsOptionsDelegate
  > = () => {
    return (req, cb) => {
      const origin = req?.headers?.origin || req?.headers?.referer;
      const corsOptions = {
        credentials: true,
        methods: ['GET', 'PATCH', 'POST', 'DELETE'],
        origin: false,
      };
  
      let hostname: string;
      if (origin) hostname = new URL(origin).hostname;
  
      if (
        !origin ||
        hostname === 'localhost' ||
        (new RegExp(/.*\.onrender\.com$/).test(hostname) &&
          process.env.NODE_ENV !== NODE_ENV.PROD)
      ) {
        corsOptions.origin = true;
        return cb(null, corsOptions);
      }
  
      corsOptions.origin = false;
      return cb(new Error('Not Allowed'), corsOptions);
    };
  };
  