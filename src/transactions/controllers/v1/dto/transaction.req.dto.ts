import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Currency, Prisma, Transaction } from "@prisma/client";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from "class-validator";
import { BaseResV1 } from "../../../../__helpers__/dto";

@ApiTags("wallets")
export class PostTransactionReq
  implements Partial<Prisma.TransactionCreateInput>
{
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ required: true })
  @IsEnum(Currency)
  currency: Currency;
}

@ApiTags("wallets")
export class TransferFundsReq extends PostTransactionReq {
  @ApiProperty({
    required: true,
    description: "The username or email of a user who will receive funds",
  })
  @IsNotEmpty()
  @IsString()
  emailOrUsername: string;
}
