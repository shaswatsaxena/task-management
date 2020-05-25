import { IsString, IsJWT } from 'class-validator';

export class AccessTokenDto {
  @IsJWT()
  access_token: string;
}
