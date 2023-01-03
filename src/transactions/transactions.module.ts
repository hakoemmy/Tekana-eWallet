import { Module } from "@nestjs/common";
import { TransactionsControllerV1 } from "./controllers/v1";
import { TransactionsService } from "./services";
import { CommonModule } from "../common/common.module";
import { WalletModule } from '../wallets/wallet.module';

@Module({
  imports: [CommonModule, WalletModule],
  controllers: [TransactionsControllerV1],
  providers: [TransactionsService],
})
export class TransactionsModule {}
