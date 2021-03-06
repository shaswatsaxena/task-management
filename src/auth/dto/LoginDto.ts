import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
} from 'class-validator';

/**
 * Data Transfer Object to be provided for login
 * @export
 * @class LoginDto
 */
export class LoginDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `Passwords should contain at least 1 upper case letter, 1 lower case letter
    and 1 number or special character`,
  })
  @ApiProperty({ minLength: 8, maxLength: 20 })
  password: string;
}
