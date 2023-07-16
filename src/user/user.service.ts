import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';
import { UserDocument } from './schemas/user.schema';
import { IQuery } from './interfaces/query.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<UserDocument>,
  ) {}

  async createUser(payload: IUser): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ email: payload.email }).exec();
    if (user) {
      throw new ConflictException('User with that email already exists');
    }
    payload.password = await bcrypt.hash(payload.password, 10);
    const newUser = new this.userModel(payload);
    await newUser.save();

    return {
      message: 'User successfully created',
    };
  }

  async getAllUsers(query: IQuery): Promise<UserDocument[]> {
    return await this.userModel.find(query).select('-password').exec();
  }

  async getUserById(id: string, userData): Promise<UserDocument> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (userData.role !== 'Admin' && userData._id.toString() !== id) {
      throw new ForbiddenException("You don't have permission to do this");
    }
    return user;
  }

  async updateUserById(
    id: string,
    payload: IUser,
    userData,
  ): Promise<{ message: string }> {
    if (userData.role !== 'Admin' && userData._id.toString() !== id) {
      throw new ForbiddenException("You don't have permission to do this");
    }
    const user = await this.userModel.findByIdAndUpdate(id, payload);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'User successfully updated',
    };
  }

  async getByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
