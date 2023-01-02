import { ApiProperty } from "@nestjs/swagger";
import { Prisma, User } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";
import { STRATEGY_LOCAL } from "../../../../__helpers__";


export class PostUserReq implements Partial<Prisma.UserCreateInput> {
    @ApiProperty({ required: true })
    @IsString()
    username: string;
  
    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty()
    @Length(8, 30)
    password: string;
  
    @ApiProperty({ required: true })
    @IsEmail()
    @Transform((n) => n.value?.toLowerCase())
    email: string;
  
    @ApiProperty({ required: false, nullable: true })
    @IsString()
    @IsOptional()
    firstName?: string;
  
    @ApiProperty({ required: false, nullable: true })
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiProperty({ required: false, nullable: true })
    @IsString()
    @IsOptional()
    phoneNumber?: string;
  }

  export class LoginReq implements Partial<User> {
    @ApiProperty()
    @IsString()
    [STRATEGY_LOCAL.usernameField]: string;
  
    @ApiProperty()
    @IsString()
    [STRATEGY_LOCAL.passwordField]: string;
  }
