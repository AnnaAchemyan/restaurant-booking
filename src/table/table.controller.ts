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
import { TableService } from './table.service';
import { CreateTableDto } from './dtos/create-table.dto';
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
import { TableDocument } from './schemas/table.schema';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { QueryDto } from './dtos/query.dto';
import { UpdateTableDto } from './dtos/update-table.dto';
import { Role } from '../user/enums/role.enum';
import { ParamsDto } from '../user/dtos/params.dto';

@ApiBearerAuth()
@ApiTags('tables')
@Controller('tables')
export class TableController {
  constructor(private tableService: TableService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBody({
    description: 'Create table DTO',
    type: CreateTableDto,
  })
  @ApiCreatedResponse({
    description: 'Table successfully created',
  })
  @ApiConflictResponse({
    description: 'Table with that number already exists',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  async createTable(@Body() payload: CreateTableDto) {
    return await this.tableService.createTable(payload);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Tables successfully received',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  async getAllTables(@Query() query: QueryDto): Promise<TableDocument[]> {
    return await this.tableService.getAllTables(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Table successfully received' })
  @ApiNotFoundResponse({ description: 'Table not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  async getTableById(@Param() params: ParamsDto): Promise<TableDocument> {
    return await this.tableService.getTableById(params.id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBody({
    description: 'Table update DTO',
    type: UpdateTableDto,
  })
  @ApiOkResponse({ description: 'Table successfully updated' })
  @ApiNotFoundResponse({ description: 'Table not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  async updateTableById(
    @Param() params: ParamsDto,
    @Body() payload: UpdateTableDto,
  ) {
    return this.tableService.updateTableById(params.id, payload);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ description: 'Table successfully deleted' })
  @ApiNotFoundResponse({ description: 'Table not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  async removeTableById(@Param() params: ParamsDto) {
    return await this.tableService.removeTableById(params.id);
  }
}
