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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body(ValidationPipe) registrationDto: RegistrationDto) {
    try {
      await this.authService.register(registrationDto);
    } catch (error) {
      if (error?.code === '23505')
        throw new ConflictException(`Email already registered!`);
      throw new InternalServerErrorException();
    }
  }
}
