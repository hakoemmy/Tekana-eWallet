import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Currency, Transaction, TransactionStatus, TransactionType } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { BaseQueryParams, ForQueryParams } from "../../../../__helpers__/dto";

@ApiTags("managment")
export class TransactionManagmentQueryParams
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

  @ApiProperty({
    required: false,
    nullable: true,
    description: "Filter wallets by userId",
  })
  @IsNumber()
  @IsOptional()
  @Transform((n) => ForQueryParams.forOptionalNumber(n))
  userId?: number;

  @ApiProperty({
    required: false,
    nullable: true,
    description: "Filter wallets by username",
  })
  @IsString()
  @IsOptional()
  @Transform((n) => ForQueryParams.forOptionalString(n))
  username?: string;

  @ApiProperty({
    required: false,
    nullable: true,
    description: "Filter wallets by user email",
  })
  @IsString()
  @IsOptional()
  @Transform((n) => ForQueryParams.forOptionalString(n))
  email?: string;
}