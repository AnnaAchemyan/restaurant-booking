import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IBooking } from './interfaces/booking.interface';
import { BookingDocument } from './schemas/booking.schema';
import { TableDocument } from '../table/schemas/table.schema';
import { MealDocument } from '../meal/schemas/meal.schema';
import { UserDocument } from '../user/schemas/user.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel('Booking')
    private bookingModel: Model<BookingDocument>,
    @InjectModel('User')
    private userModel: Model<UserDocument>,
    @InjectModel('Table')
    private tableModel: Model<TableDocument>,
    @InjectModel('Meal')
    private mealModel: Model<MealDocument>,
  ) {}

  async createBooking(payload: IBooking, userData): Promise<BookingDocument> {
    const user = await this.userModel.findById(userData.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const table = await this.tableModel.findById(payload.tableId).exec();
    if (!table) {
      throw new NotFoundException('Table not found');
    }

    if (new Date(payload.date) <= new Date()) {
      throw new ForbiddenException('Incorrect date');
    }
    const newDate = new Date(payload.date).toISOString().split('T')[0];

    const booking = await this.bookingModel
      .findOne({
        table: table.id,
        date: newDate,
        time: payload.time,
      })
      .exec();

    if (booking) {
      throw new ConflictException('Table already reserved for that time');
    }

    if (payload.orderItems) {
      payload.orderItems.map(async (itm) => {
        const meal = await this.mealModel.findById(itm.mealId).exec();
        if (!meal) {
          throw new NotFoundException('Meal not found');
        }
      });
    }

    const newBooking = new this.bookingModel({
      ...payload,
      user: user.id,
      table: table.id,
      date: newDate,
    });
    await newBooking.save();

    return newBooking;
  }
  async getAllBookings(): Promise<BookingDocument[]> {
    return await this.bookingModel.find().exec();
  }

  async getBookingById(id: string): Promise<BookingDocument> {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async updateBookingById(
    id: string,
    payload: IBooking,
    userData,
  ): Promise<{ message: string }> {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (userData.role !== 'Admin' && userData.id !== booking.user.toString()) {
      throw new ForbiddenException("You don't have permission to do this");
    }
    let table;
    if (payload.tableId && payload.tableId !== booking.table.toString()) {
      table = await this.tableModel.findById(payload.tableId).exec();
      if (!table) {
        throw new NotFoundException('Table not found');
      }
    }
    let newDate;
    if (payload.date) {
      if (new Date(payload.date) <= new Date()) {
        throw new ForbiddenException('Incorrect date');
      }
      newDate = new Date(payload.date).toISOString().split('T')[0];
    }

    const exists = await this.bookingModel
      .findOne({
        table: table?.id || booking.table,
        date: newDate || booking.date,
        time: payload.time || booking.time,
      })
      .exec();

    if (exists && exists.id !== id) {
      throw new ConflictException('Table already reserved for that time');
    }

    if (payload.orderItems) {
      for (const itm of payload.orderItems) {
        const meal = await this.mealModel.findById(itm.mealId).exec();
        if (!meal) {
          throw new NotFoundException('Meal not found');
        }
      }
    }

    booking.set({
      ...payload,
      table: table?.id || booking.table,
      date: newDate || booking.date,
    });
    await booking.save();
    return {
      message: 'Booking successfully updated',
    };
  }

  async removeBookingById(id: string): Promise<{ message: string }> {
    const booking = await this.bookingModel.findByIdAndDelete(id);
    if (!booking) {
      throw new NotFoundException('Booking not found.');
    }
    return {
      message: 'Booking successfully deleted',
    };
  }

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeOldBookings(): Promise<void> {
    const currentTime = new Date();
    const bookings = await this.bookingModel.find();
    for (const itm of bookings) {
      if (itm.date.getTime() + 48 * 60 * 60 * 1000 < currentTime.getTime()) {
        await this.bookingModel.findByIdAndDelete(itm.id);
      }
    }
  }
}
