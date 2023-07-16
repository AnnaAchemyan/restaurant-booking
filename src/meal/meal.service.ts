import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMeal } from './interfaces/meal.interface';
import { MealDocument } from './schemas/meal.schema';
import { IQuery } from './interfaces/query.interface';

@Injectable()
export class MealService {
  constructor(
    @InjectModel('Meal')
    private mealModel: Model<MealDocument>,
  ) {}

  async createMeal(payload: IMeal): Promise<MealDocument> {
    const newMeal = new this.mealModel(payload);
    await newMeal.save();

    return newMeal;
  }

  async getAllMeals(query: IQuery): Promise<MealDocument[]> {
    return await this.mealModel.find(query).exec();
  }

  async getMealById(id: string): Promise<MealDocument> {
    const meal = await this.mealModel.findById(id).exec();
    if (!meal) {
      throw new NotFoundException('Meal not found');
    }
    return meal;
  }

  async updateMealById(
    id: string,
    payload: IMeal,
  ): Promise<{ message: string }> {
    const meal = await this.mealModel.findByIdAndUpdate(id, payload);
    if (!meal) {
      throw new NotFoundException('Meal not found');
    }
    return {
      message: 'Meal successfully updated',
    };
  }

  async removeMealById(id: string): Promise<{ message: string }> {
    const meal = await this.mealModel.findByIdAndDelete(id);
    if (!meal) {
      throw new NotFoundException('Meal is not found.');
    }
    return {
      message: 'Meal successfully deleted',
    };
  }
}
