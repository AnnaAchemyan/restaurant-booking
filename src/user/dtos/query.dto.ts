import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  email: string;
}
