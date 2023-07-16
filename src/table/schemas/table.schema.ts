import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TableDocument = Table & Document;

@Schema({ timestamps: true })
export class Table {
  @Prop({ required: true })
  number: number;

  @Prop({ required: true })
  capacity: number;
}

export const TableSchema = SchemaFactory.createForClass(Table);
