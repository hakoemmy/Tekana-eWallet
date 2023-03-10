import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { JwtModule } from "@nestjs/jwt";
import { configModuleOptions } from "./app.module.config";
import { ConfigModule } from "@nestjs/config";
import { CommonModule } from "./common/common.module";
import { UserModule } from "./users/users.module";
import { RouterModule } from "@nestjs/core";
import { WalletModule } from "./wallets/wallet.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { ManagmentModule } from "./managment/managment.module";

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot(configModuleOptions),
    CommonModule,
    UserModule,
    WalletModule,
    TransactionsModule,
    ManagmentModule,
    RouterModule.register([
      {
        path: "users",
        module: UserModule,
      },
      {
        path: "wallets",
        module: WalletModule,
      },
      {
        path: "managment",
        module: ManagmentModule,
      },
    ]),
  ],
  controllers: [AppController],
})
export class AppModule {}
