import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Table } from '../../table/schemas/table.schema';
import { Meal } from '../../meal/schemas/meal.schema';

export type BookingDocument = Booking & Document;

@Schema({ _id: false })
class OrderItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal',
    required: true,
  })
  mealId: Meal;

  @Prop({ required: false, default: 1 })
  count: number;
}
@Schema({ timestamps: true })
export class Booking {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true,
  })
  table: Table;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop([{ type: OrderItem, required: false }])
  orderItems: OrderItem[];
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
