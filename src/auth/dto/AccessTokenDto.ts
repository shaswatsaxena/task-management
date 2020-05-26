import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

/**
 * Data Transfer Object sent after successful login
 * @export
 * @class AccessTokenDto
 */
export class AccessTokenDto {
  @IsJWT()
  @ApiProperty()
  access_token: string;
}
