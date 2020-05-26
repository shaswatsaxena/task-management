import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/users/user.entity';

/**
 * Local Strategy (username + password) for PassportJS
 * @export
 * @class LocalStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   *Creates an instance of LocalStrategy.
   * @param {AuthService} authService
   * @memberof LocalStrategy
   */
  constructor(private authService: AuthService) {
    // We will be using email instead of username and stateless authentication
    super({
      usernameField: 'email',
      session: false,
    });
  }

  /**
   * Logic to check if provided email password combo is valid or not
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Omit<User, 'password_hash'>>}
   * @memberof LocalStrategy
   */
  async validate(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password_hash'>> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
