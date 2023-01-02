import 'reflect-metadata';
import fastifyCors from '@fastify/cors';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';
import { PrismaService } from '../common/services';
import { fastifyCorsCallback } from './cors';

export async function bootstrapCommon(
  app: NestFastifyApplication,
  prisma: PrismaService,
) {

  app
    .setGlobalPrefix('api')
    .enableVersioning({ type: VersioningType.URI })
    .useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
    .useGlobalInterceptors(
      new ClassSerializerInterceptor(new Reflector(), {
        strategy: 'excludeAll',
      }),
    );

  await prisma.enableShutdownHooks(app);
  await app.register(fastifyCookie);
  await app.register(fastifyCors, fastifyCorsCallback);
}
