import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDocument } from './schemas/user.schema';
import { ParamsDto } from './dtos/params.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { QueryDto } from './dtos/query.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiBody({
    description: 'Create user DTO',
    type: CreateUserDto,
  })
  @ApiCreatedResponse({
    description: 'User successfully created',
  })
  @ApiConflictResponse({
    description: 'User with that email already exists',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  async createUser(@Body() payload: CreateUserDto) {
    return await this.userService.createUser(payload);
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({
    description: 'Users successfully received',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  async getAllUsers(@Query() query: QueryDto): Promise<UserDocument[]> {
    return await this.userService.getAllUsers(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'User successfully received' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  async getUserById(
    @Param() params: ParamsDto,
    @Req() req,
  ): Promise<UserDocument> {
    return await this.userService.getUserById(params.id, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    description: 'User update DTO',
    type: UpdateUserDto,
  })
  @ApiOkResponse({ description: 'User successfully updated' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  async updateUserById(
    @Param() params: ParamsDto,
    @Body() payload: UpdateUserDto,
    @Req() req,
  ) {
    return this.userService.updateUserById(params.id, payload, req.user);
  }
}
