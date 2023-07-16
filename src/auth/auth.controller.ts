import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { IUserData } from './interface/user-data.interface';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({ description: 'You have successfully logged in.' })
  @ApiForbiddenResponse({ description: 'Invalid email or password' })
  async login(@Request() { user }: { user: IUserData }): Promise<any> {
    return this.authService.login(user);
  }
}
