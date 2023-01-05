import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Currency, Wallet } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { BaseQueryParams, ForQueryParams } from "../../../../__helpers__/dto";

@ApiTags("managment")
export class WalletManagmentQueryParams
  extends BaseQueryParams
  implements Partial<Wallet>
{
  @ApiProperty({
    enum: Currency,
    required: false,
    nullable: true,
    description: "Filter wallets by currency",
  })
  @IsEnum(Currency)
  @IsOptional()
  @Transform((n) => ForQueryParams.forOptionalString(n))
  currency?: Currency;

  @ApiProperty({
    required: false,
    nullable: true,
    description: "Filter wallets by balance",
  })
  @IsNumber()
  @IsOptional()
  @Transform((n) => ForQueryParams.forOptionalNumber(n))
  balance?: number;

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
