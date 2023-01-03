import { Module } from "@nestjs/common";
import { WalletControllerV1 } from "./controllers/v1";
import { WalletService } from "./services";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [CommonModule],
  controllers: [WalletControllerV1],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
