import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { JwtModule } from "@nestjs/jwt";
import { configModuleOptions } from "./app.module.config";
import { ConfigModule } from "@nestjs/config";
import { CommonModule } from "./common/common.module";
import { UserModule } from "./users/users.module";
import { RouterModule } from "@nestjs/core";

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot(configModuleOptions),
    CommonModule,
    UserModule,
    RouterModule.register([{ path: "users", module: UserModule }]),
  ],
  controllers: [AppController],
})
export class AppModule {}
