import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';
import { ForQueryParams } from './transform-query-params';

type Paginate = { take: number; skip: number };

export abstract class BaseQueryParams implements Partial<Paginate> {
  @ApiProperty({
    required: false,
    type: 'integer',
    nullable: true,
    description: 'Paginate',
  })
  @IsOptional()
  @Transform((n) => ForQueryParams.forOptionalNumber(n))
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiProperty({
    required: false,
    type: 'integer',
    nullable: true,
    description: 'Paginate',
  })
  @IsOptional()
  @Transform((n) => ForQueryParams.forOptionalNumber(n))
  @IsInt()
  @Min(0)
  take?: number;
}
