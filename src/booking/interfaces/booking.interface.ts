import { TimeIntervalsEnum } from '../enums/time-intervals.enum';

interface IOrderItem {
  mealId?: string;
  count?: number;
}

export interface IBooking {
  tableId?: string;
  date?: Date;
  time?: TimeIntervalsEnum;
  orderItems?: IOrderItem[];
}
