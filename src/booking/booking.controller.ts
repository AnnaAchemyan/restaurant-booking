import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BookingDocument } from './schemas/booking.schema';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { Role } from '../user/enums/role.enum';
import { ParamsDto } from '../user/dtos/params.dto';

@ApiBearerAuth()
@ApiTags('bookings')
@Controller('bookings')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    description: 'Create booking DTO',
    type: CreateBookingDto,
  })
  @ApiCreatedResponse({
    description: 'Booking successfully created',
  })
  @ApiResponse({
    status: 404,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            user: {
              description: 'User not found',
            },
            table: {
              description: 'Table not found',
            },
            meal: {
              description: 'Meal not found',
            },
          },
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Table already reserved for that time',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  async createBooking(@Body() payload: CreateBookingDto, @Req() req) {
    return await this.bookingService.createBooking(payload, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Bookings successfully received',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  async getAllBookings(): Promise<BookingDocument[]> {
    return await this.bookingService.getAllBookings();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Booking successfully received' })
  @ApiNotFoundResponse({ description: 'Booking not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  async getBookingById(@Param() params: ParamsDto): Promise<BookingDocument> {
    return await this.bookingService.getBookingById(params.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    description: 'Booking update DTO',
    type: UpdateBookingDto,
  })
  @ApiOkResponse({ description: 'Booking successfully updated' })
  @ApiResponse({
    status: 404,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            user: {
              description: 'Booking not found',
            },
            table: {
              description: 'Table not found',
            },
            meal: {
              description: 'Meal not found',
            },
          },
        },
      },
    },
  })
  @ApiConflictResponse({ description: 'Table already reserved for that time' })
  @ApiForbiddenResponse({ description: "You don't have permission to do this" })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  async updateBookingById(
    @Param() params: ParamsDto,
    @Body() payload: UpdateBookingDto,
    @Req() req,
  ) {
    return await this.bookingService.updateBookingById(
      params.id,
      payload,
      req.user,
    );
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ description: 'Booking successfully deleted' })
  @ApiNotFoundResponse({ description: 'Booking not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized user' })
  async removeBookingById(@Param() params: ParamsDto) {
    return await this.bookingService.removeBookingById(params.id);
  }
}
