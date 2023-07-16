import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class ParamsDto {
  @ApiProperty()
  @IsMongoId()
  id: string;
}
