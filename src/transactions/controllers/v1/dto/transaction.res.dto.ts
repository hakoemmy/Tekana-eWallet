import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Prisma, Transaction, TransactionType, Wallet } from "@prisma/client";
import { Expose, Transform } from "class-transformer";
import { WalletBalanceRes } from "../../../../wallets/controllers/v1/dto";
import { BaseResV1 } from "../../../../__helpers__/dto";

@ApiTags("wallets")
export class GetTransactionRes
  extends BaseResV1
  implements Partial<Transaction>
{
  @ApiProperty({
    type: "integer",
    description: "The transaction Id",
  })
  @Expose()
  id: number;

  @ApiProperty({ description: "The transaction type" })
  @Expose()
  purpose: TransactionType;

  @ApiProperty({ description: "The transaction amount" })
  @Expose()
  amount?: number;

  @ApiProperty({
    type: WalletBalanceRes,
    description: "Credited wallet",
  })
  @Transform((n) => (n.value ? new WalletBalanceRes(n.value) : undefined))
  @Expose()
  toWallet: Partial<Wallet>;

  @ApiProperty({
    type: WalletBalanceRes,
    description: "Dibited wallet",
  })
  @Transform((n) => (n.value ? new WalletBalanceRes(n.value) : undefined))
  @Expose()
  fromWallet: Partial<Wallet>;

  @ApiProperty({ description: "The transaction date" })
  @Expose()
  createdAt?: Date;
}
