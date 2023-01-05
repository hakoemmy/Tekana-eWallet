import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { Role, User } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";
import { BaseQueryParams, ForQueryParams } from "../../../../__helpers__/dto";

@ApiTags("managment")
export class UserManagmentQueryParams extends BaseQueryParams implements Partial<User> {
  @ApiProperty({
    description: "Filter by users with verified email or not",
    nullable: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform((n) => ForQueryParams.forOptionalBoolean(n))
  emailVerified?: boolean;

  @ApiProperty({
    description: "Filter by users with verified phone number or not",
    nullable: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform((n) => ForQueryParams.forOptionalBoolean(n))
  phoneNumberVerified?: boolean;

  @ApiProperty({
    description: "Filter by flagged users flag",
    nullable: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  @Transform((n) => ForQueryParams.forOptionalBoolean(n))
  flagged?: boolean;

  @ApiProperty({
    enum: Role,
    required: false,
    nullable: true,
    isArray: true,
    description: "Filter users by role",
  })
  @IsEnum(Role, { each: true })
  @IsOptional()
  @Transform((n) => ForQueryParams.forOptionalString(n))
  Roles?: Role[];
}
