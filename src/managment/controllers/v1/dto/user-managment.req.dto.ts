import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEnum } from "class-validator";
import { PostUserReq } from "../../../../users/controllers/v1/dto";

export class CreateUserReq extends PostUserReq {
  @ApiProperty({
    enum: Role,
    required: true,
    isArray: true,
    description: "Specify the role a user will have",
  })
  @IsEnum(Role, { each: true })
  Roles?: Role[];
}
