import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Jwt Strategy for PassportJS
 * @export
 * @class JwtStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of JwtStrategy.
   * @param {ConfigService} configService
   * @memberof JwtStrategy
   */
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }
  /**
   * returns data to be added to req.user from decoding access_token payload.
   * @param {*} payload
   * @returns
   * @memberof JwtStrategy
   */
  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}
