import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Currency, User, Wallet } from "@prisma/client";
import { Expose, Transform } from "class-transformer";
import { GetUserRes } from "../../../../users/controllers/v1/dto";
import { BaseResV1 } from "../../../../__helpers__/dto";

@ApiTags("wallets")
export class WalletBalanceRes extends BaseResV1 implements Partial<Wallet> {
  @ApiProperty({
    type: "integer",
    description: "Wallet ID associated with the user",
  })
  @Expose()
  id: number;

  @ApiProperty({ type: "integer", description: "User ID of the wallet" })
  @Expose()
  userId: number;

  @ApiProperty({ description: "The currency of funds in a wallet" })
  @Expose()
  currency: Currency;

  @ApiProperty({ description: "Available Balance in the wallet" })
  @Expose()
  balance: number;

  @ApiProperty({
    type: GetUserRes,
    description: "Wallet owner",
  })
  @Transform((n) => (n.value ? new GetUserRes(n.value) : undefined))
  @Expose()
  User: Partial<User>;
}
