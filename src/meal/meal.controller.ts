import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto } from './dtos/create-meal.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MealDocument } from './schemas/meal.schema';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { QueryDto } from './dtos/query.dto';
import { UpdateMealDto } from './dtos/update-meal.dto';
import { Role } from '../user/enums/role.enum';
import { ParamsDto } from '../user/dtos/params.dto';

@ApiBearerAuth()
@ApiTags('meals')
@Controller('meals')
export class MealController {
  constructor(private mealService: MealService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBody({
    description: 'Create meal DTO',
    type: CreateMealDto,
  })
  @ApiCreatedResponse({
    description: 'Meal successfully created',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  async createMeal(@Body() payload: CreateMealDto) {
    return await this.mealService.createMeal(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Meals successfully received',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  async getAllMeals(@Query() query: QueryDto): Promise<MealDocument[]> {
    return await this.mealService.getAllMeals(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Meal successfully received' })
  @ApiNotFoundResponse({ description: 'Meal not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  async getMealById(@Param() params: ParamsDto): Promise<MealDocument> {
    return await this.mealService.getMealById(params.id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBody({
    description: 'Meal update DTO',
    type: UpdateMealDto,
  })
  @ApiOkResponse({ description: 'Meal successfully updated' })
  @ApiNotFoundResponse({ description: 'Meal not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  async updateMealById(
    @Param() params: ParamsDto,
    @Body() payload: UpdateMealDto,
  ) {
    return this.mealService.updateMealById(params.id, payload);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ description: 'Meal successfully deleted' })
  @ApiNotFoundResponse({ description: 'Meal not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  async removeMealById(@Param() params: ParamsDto) {
    return await this.mealService.removeMealById(params.id);
  }
}
