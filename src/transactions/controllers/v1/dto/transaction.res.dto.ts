import { ApiProperty, ApiTags } from "@nestjs/swagger";
import {
  Currency,
  Transaction,
  TransactionStatus,
  TransactionType,
  Wallet,
} from "@prisma/client";
import { Expose, Transform } from "class-transformer";
import { IsEnum, isEnum, IsInt, IsOptional } from "class-validator";
import { WalletBalanceRes } from "../../../../wallets/controllers/v1/dto";
import {
  BaseQueryParams,
  BaseResV1,
  ForQueryParams,
} from "../../../../__helpers__/dto";

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

@ApiTags("wallets")
export class TransactionQueryParams
  extends BaseQueryParams
  implements Partial<Transaction>
{
  @ApiProperty({
    description: "Filter by transaction type",
    nullable: true,
    required: false,
  })
  @IsEnum(TransactionType)
  @IsOptional()
  @Transform((n) => ForQueryParams.forOptionalString(n))
  purpose?: TransactionType;

  @ApiProperty({
    description: "Filter by transaction status",
    nullable: true,
    required: false,
  })
  @IsEnum(TransactionStatus)
  @IsOptional()
  @Transform((n) => ForQueryParams.forOptionalString(n))
  status?: TransactionStatus;

  @ApiProperty({
    description: "Filter by wallet currency",
    nullable: true,
    required: false,
  })
  @IsEnum(Currency)
  @IsOptional()
  @Transform((n) => ForQueryParams.forOptionalString(n))
  currency?: Currency;
}
