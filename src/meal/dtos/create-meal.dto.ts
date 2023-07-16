import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMealDto {
  @ApiProperty({ type: String, required: true, description: 'Name of meal' })
  @Length(1, 50)
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Description for the meal',
  })
  @Length(1, 500)
  @IsString()
  description: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Price of meal',
  })
  @Length(1, 50)
  @IsString()
  price: string;
}
