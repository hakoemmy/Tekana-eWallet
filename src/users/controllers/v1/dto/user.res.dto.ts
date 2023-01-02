import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Role, User } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";
import { BaseResV1 } from "src/__helpers__/dto";

@ApiTags("users")
export class GetUserRes extends BaseResV1 implements Partial<User> {
  @Expose()
  @ApiProperty({ type: "integer" })
  id: number;

  @Expose()
  @ApiProperty({
    enum: Role,
    isArray: true,
    nullable: true,
    description: "User assigned roles",
  })
  Roles?: Role[];

  @Expose()
  @ApiProperty({ nullable: true })
  email: string;

  @Expose()
  @ApiProperty()
  username: string;

  @Expose()
  @ApiProperty({ nullable: true })
  firstName?: string;

  @Expose()
  @ApiProperty({ nullable: true })
  lastName?: string;

  @Expose()
  @ApiProperty({ nullable: true })
  phoneNumber?: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  password?: string;

  @Expose()
  @ApiProperty({ type: "boolean" })
  emailVerified?: boolean;

  @Expose()
  @ApiProperty({ type: "boolean" })
  phoneNumberVerified?: boolean;
}
