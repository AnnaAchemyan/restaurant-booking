import { IsNumberString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTableDto {
  @ApiProperty({ type: Number, required: true, description: 'Number of table' })
  @Length(1, 10)
  @IsNumberString()
  number: number;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Capacity of table',
  })
  @Length(1, 10)
  @IsNumberString()
  capacity: number;
}
