import { Module } from "@nestjs/common";
import {
  UserManagmentControllerV1,
  WalletManagmentControllerV1,
  TransactionManagmentControllerV1,
} from "./controllers/v1";
import { CommonModule } from "../common/common.module";
import { WalletModule } from "../wallets/wallet.module";
import { UserModule } from "../users/users.module";
import { TransactionsModule } from "../transactions/transactions.module";

@Module({
  imports: [CommonModule, WalletModule, UserModule, TransactionsModule],
  controllers: [
    UserManagmentControllerV1,
    WalletManagmentControllerV1,
    TransactionManagmentControllerV1,
  ]
})
export class ManagmentModule {}
