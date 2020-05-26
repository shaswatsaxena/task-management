import {
  Controller,
  UseGuards,
  Request,
  Post,
  ConflictException,
  InternalServerErrorException,
  Body,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiTags,
  ApiInternalServerErrorResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/RegistrationDto';
import { AccessTokenDto } from './dto/AccessTokenDto';
import { LoginDto } from './dto/LoginDto';

@Controller('auth')
@ApiTags('auth')
@ApiInternalServerErrorResponse({
  description: 'Internal Server Error',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    status: 200,
    type: AccessTokenDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async login(@Request() req): Promise<AccessTokenDto> {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiCreatedResponse()
  @ApiConflictResponse({ description: `Email already registered!` })
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
