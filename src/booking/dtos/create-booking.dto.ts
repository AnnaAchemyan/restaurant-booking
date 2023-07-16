import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TimeIntervalsEnum } from '../enums/time-intervals.enum';
import { Type } from 'class-transformer';

class OrderItem {
  @ApiProperty({ required: true })
  @IsMongoId()
  mealId: string;

  @ApiProperty({ required: false, default: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  count: number;
}
export class CreateBookingDto {
  @ApiProperty({ required: true })
  @IsMongoId()
  tableId: string;

  @ApiProperty({ required: true })
  @IsDateString()
  date: Date;

  @ApiProperty({ required: true })
  @IsEnum(TimeIntervalsEnum)
  time: TimeIntervalsEnum;

  @ApiProperty({ type: OrderItem, required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  orderItems: OrderItem[];
}
