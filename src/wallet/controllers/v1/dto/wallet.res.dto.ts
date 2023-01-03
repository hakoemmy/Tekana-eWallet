import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Currency, Wallet } from "@prisma/client";
import { Expose } from "class-transformer";
import { BaseResV1 } from "../../../../__helpers__/dto";


@ApiTags('wallet')
export class WalletBalanceRes extends BaseResV1 implements Partial<Wallet> {
  @ApiProperty({
    type: 'integer',
    description: 'Wallet ID associated with the user',
  })
  @Expose()
  id: number;

  @ApiProperty({ type: 'integer', description: 'User ID of the wallet' })
  @Expose()
  userId: number;

  @ApiProperty({ description: 'The currency of funds in a wallet' })
  @Expose()
  currency: Currency;

  @ApiProperty({ description: 'Available Balance in the wallet' })
  @Expose()
  balance: number;
}
