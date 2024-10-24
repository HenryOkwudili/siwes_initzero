import { ApiProperty } from '@nestjs/swagger';
import { SchoolType } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSchoolDto {
  @ApiProperty({
    type: String,
    description: 'School name',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'School Registration code',
    required: true,
  })
  @IsString()
  regCode: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'School address',
  })
  @IsString()
  address: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'School bio',
  })
  @IsString()
  bio: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'School Email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'School Phone Number',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    type: String,
    description: 'School logo',
    required: false,
  })
  logo: string;

  @ApiProperty({
    enum: SchoolType,
    description: 'School Type (SECONDARY or TERTIARY)',
  })
  @IsNotEmpty()
  schoolType: string;
}
