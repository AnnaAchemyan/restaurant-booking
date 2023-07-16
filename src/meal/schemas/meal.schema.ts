import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MealDocument = Meal & Document;

@Schema({ timestamps: true })
export class Meal {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  price: string;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
