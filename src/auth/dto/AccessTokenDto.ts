import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsJWT } from 'class-validator';

export class AccessTokenDto {
  @IsJWT()
  @ApiProperty()
  access_token: string;
}
