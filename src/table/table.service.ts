import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITable } from './interfaces/table.interface';
import { TableDocument } from './schemas/table.schema';
import { IQuery } from './interfaces/query.interface';

@Injectable()
export class TableService {
  constructor(
    @InjectModel('Table')
    private tableModel: Model<TableDocument>,
  ) {}

  async createTable(payload: ITable): Promise<TableDocument> {
    const table = await this.tableModel
      .findOne({ number: payload.number })
      .exec();
    if (table) {
      throw new ConflictException('Table with that number already exists');
    }
    const newTable = new this.tableModel(payload);
    await newTable.save();

    return newTable;
  }

  async getAllTables(query: IQuery): Promise<TableDocument[]> {
    return await this.tableModel.find(query).exec();
  }

  async getTableById(id: string): Promise<TableDocument> {
    const table = await this.tableModel.findById(id).exec();
    if (!table) {
      throw new NotFoundException('Table not found');
    }
    return table;
  }

  async updateTableById(
    id: string,
    payload: ITable,
  ): Promise<{ message: string }> {
    const table = await this.tableModel.findById(id);
    if (!table) {
      throw new NotFoundException('Table not found');
    }
    if (payload.number) {
      const exists = await this.tableModel.findOne({ number: payload.number });
      if (exists && exists.id !== id) {
        throw new ConflictException('Table with that number already exists');
      }
    }
    await this.tableModel.updateOne({ _id: id }, { ...payload });
    return {
      message: 'Table successfully updated',
    };
  }

  async removeTableById(id: string): Promise<{ message: string }> {
    const table = await this.tableModel.findByIdAndDelete(id);
    if (!table) {
      throw new NotFoundException('Table not found.');
    }
    return {
      message: 'Table successfully deleted',
    };
  }
}
