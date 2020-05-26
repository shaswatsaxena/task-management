import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/user.entity';
import { RegistrationDto } from './dto/RegistrationDto';
import { AccessTokenDto } from './dto/AccessTokenDto';

/**
 * Consists of Services for Authentication
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService {
  /**
   *Creates an instance of AuthService.
   * @param {UsersService} usersService
   * @param {JwtService} jwtService
   * @memberof AuthService
   */
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Checks if the user exists and the password is correct
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Omit<User, 'password_hash'>>}
   * @memberof AuthService
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password_hash'>> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Generates accessToken with payload after successful logins
   * @param {User} user
   * @returns {Promise<AccessTokenDto>}
   * @memberof AuthService
   */
  async login(user: User): Promise<AccessTokenDto> {
    const payload = { email: user.email, name: user.name, sub: user.id };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        expiresIn: '30d',
      }),
    };
  }

  /**
   * Hashes password and sends the data to userService to be inserted into db
   * @param {RegistrationDto} { email, password, name }
   * @returns {Promise<void>}
   * @memberof AuthService
   */
  async register({ email, password, name }: RegistrationDto): Promise<void> {
    const password_hash = await bcrypt.hash(password, 10);
    await this.usersService.addUser({ email, password_hash, name });
  }
}
