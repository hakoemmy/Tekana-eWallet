import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { EVK, NODE_ENV } from './__helpers__';
import { PrismaService } from './common/services';
import { createFastify } from './__helpers__/fastify'
import {
  createOpenAPISpecDocument,
  createSwaggerUI,
  writeAPISpecDocumentToFs,
  bootstrapCommon,
} from './__bootstrap__';

const environment = process.env[EVK.NODE_ENV];
const fastifyAdapter = createFastify(environment !== NODE_ENV.TEST);

async function createNestApplication(environment: string) {
  if (environment === NODE_ENV.TEST) {
    const mod = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    return mod.createNestApplication<NestFastifyApplication>(fastifyAdapter);
  }

  return await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
}

export async function bootstrap() {
  const app: NestFastifyApplication = await createNestApplication(environment);

  const config = app.get(ConfigService);
  const prisma = app.get(PrismaService);

  bootstrapCommon(app, prisma);
  const openApiDocument = createOpenAPISpecDocument(app);

  if (environment === NODE_ENV.DEV) createSwaggerUI(app, openApiDocument);

  const PORT = config.get(EVK.PORT);
  const ADDR = '0.0.0.0';

  switch (environment) {
    case NODE_ENV.TEST: {
      await app.init();
      return app;
    }
    case NODE_ENV.BUILD_ONLY: {
      writeAPISpecDocumentToFs(openApiDocument);
      return process.exit(0);
    }
    default: {
      writeAPISpecDocumentToFs(openApiDocument);

      if (process.env[EVK.NODE_ENV] === NODE_ENV.PROD) {
        process.on('SIGTERM', async () => {
          await app.close();
          console.log('SIGTERM received, gracefully shutting down');
        });
      }

      await app.listen(PORT, ADDR).then(() => {
        console.log(`Listening at ${ADDR}:${PORT}`);
      });
    }
  }
}

if (process.env[EVK.NODE_ENV] !== NODE_ENV.TEST) {
  bootstrap();
}

