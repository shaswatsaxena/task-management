import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
} from 'class-validator';

/**
 * Data Transfer Object provided for registration
 * @export
 * @class RegistrationDto
 */
export class RegistrationDto {
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

  @IsString()
  @MaxLength(32)
  @ApiProperty({ maxLength: 32 })
  name: string;
}
