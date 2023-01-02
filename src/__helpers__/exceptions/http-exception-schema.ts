import { HttpException as Exception } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('Exceptions')
export class HttpExceptionSchema extends Exception {
  @ApiProperty()
  message: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  error: string;
}
