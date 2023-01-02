import * as fs from "fs";
import * as path from "path";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { JWT_COOKIE_NAME } from "../__helpers__/enums";

export function createOpenAPISpecDocument(app: NestFastifyApplication) {
  const builder = new DocumentBuilder()
    .setTitle("Tekana-eWallet API")
    .addSecurity(JWT_COOKIE_NAME.AT, {
      type: "apiKey",
      in: "cookie",
      name: JWT_COOKIE_NAME.AT,
    })
    .addSecurity(JWT_COOKIE_NAME.RT, {
      type: "apiKey",
      in: "cookie",
      name: JWT_COOKIE_NAME.RT,
    })
    .build();

  return SwaggerModule.createDocument(app, builder, { deepScanRoutes: true });
}

export function createSwaggerUI(
  app: NestFastifyApplication,
  document: OpenAPIObject,
  path = "openapi"
) {
  return SwaggerModule.setup(path, app, document, {
    swaggerOptions: { withCredentials: true },
  });
}

export function writeAPISpecDocumentToFs(document: OpenAPIObject) {
  fs.writeFileSync(
    path.join(path.resolve(process.cwd(), "dist"), "openapi-spec.json"),
    JSON.stringify(document)
  );
}
