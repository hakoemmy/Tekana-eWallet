import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Currency, Prisma, Transaction } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { BaseResV1 } from "../../../../__helpers__/dto";

@ApiTags('wallets')
export class PostTransactionReq implements Partial<Prisma.TransactionCreateInput> {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ required: true })
  @IsEnum(Currency)
  currency: Currency;
}


