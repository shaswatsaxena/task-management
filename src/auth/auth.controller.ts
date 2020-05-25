import {
  Controller,
  UseGuards,
  Request,
  Post,
  ConflictException,
  InternalServerErrorException,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/RegistrationDto';
import { AccessTokenDto } from './dto/AccessTokenDto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req): Promise<AccessTokenDto> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(
    @Body(ValidationPipe) registrationDto: RegistrationDto,
  ): Promise<void> {
    try {
      await this.authService.register(registrationDto);
    } catch (error) {
      // Error code 23505 represents duplicate entry on an unique field
      if (error?.code === '23505')
        throw new ConflictException(`Email already registered!`);
      throw new InternalServerErrorException();
    }
  }
}
