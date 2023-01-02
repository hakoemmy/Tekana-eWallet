import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { JwtModule } from "@nestjs/jwt";
import { configModuleOptions } from "./app.module.config";
import { ConfigModule } from "@nestjs/config";
import { CommonModule } from "./common/common.module";
@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot(configModuleOptions),
    CommonModule
  ],
  controllers: [AppController],
})
export class AppModule {}
