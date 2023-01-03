import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { JwtModule } from "@nestjs/jwt";
import { configModuleOptions } from "./app.module.config";
import { ConfigModule } from "@nestjs/config";
import { CommonModule } from "./common/common.module";
import { UserModule } from "./users/users.module";
import { RouterModule } from "@nestjs/core";
import { WalletModule } from "./wallet/wallet.module";
@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot(configModuleOptions),
    CommonModule,
    UserModule,
    WalletModule,
    RouterModule.register([
      {
        path: "users",
        module: UserModule,
      },
      {
        path: "wallet",
        module: WalletModule,
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
