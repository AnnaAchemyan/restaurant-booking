import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class QueryDto {
  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  number: number;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  capacity: number;
}
