import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    type: String,
    description: 'first_name',
  })
  @IsNotEmpty()
  @IsString({ message: 'Invalid character' })
  firstName: string;

  @ApiProperty({
    type: String,
    description: 'last_name',
  })
  @IsNotEmpty()
  @IsString({ message: 'Invalid character' })
  lastName: string;

  @ApiProperty({
    type: String,
    description:
      'Email address of the user. Must be a valid email format (e.g., example@example.com)',
    example: 'example@example.com',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    type: String,
    minimum: 8,
    maximum: 20,
    description: 'At least 1 capital, 1 small, 1 special character & 1 number',
  })
  @IsString()
  @MaxLength(20)
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;
}
