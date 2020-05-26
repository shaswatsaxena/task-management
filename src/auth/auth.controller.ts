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

/**
 * Controller for /auth routes.
 * @export
 * @class AuthController
 */
@Controller('auth')
@ApiTags('auth')
@ApiInternalServerErrorResponse({
  description: 'Internal Server Error',
})
export class AuthController {
  /**
   * Creates an instance of AuthController.
   * @param {AuthService} authService
   * @memberof AuthController
   */
  constructor(private authService: AuthService) {}

  /**
   * Tries to login a user and provide access-token.
   * Handled by PassportJS local strategy
   * @param {*} req
   * @returns {Promise<AccessTokenDto>}
   * @memberof AuthController
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    status: 200,
    type: AccessTokenDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async login(@Request() req: any): Promise<AccessTokenDto> {
    return this.authService.login(req.user);
  }

  /**
   * Register a user or throw Conflict error if email already exits
   * @param {RegistrationDto} registrationDto
   * @returns {Promise<void>}
   * @memberof AuthController
   */
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
