import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDate,
} from 'class-validator';
import { AccountType, Level, Sex } from '@prisma/client';
import { CreateAccountDto } from '../create-account.dto';
import { Transform } from 'class-transformer';

export class CreateStudentFromExcelDto {
  @ApiProperty({
    enum: AccountType,
  })
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
  accountType: AccountType;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  localGovernment: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  stateOfOrigin: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    enum: Sex,
  })
  @IsNotEmpty()
  sex: Sex;

  @ApiProperty({
    enum: Level,
  })
  @IsNotEmpty()
  level: Level;

  @ApiProperty({
    type: String,
    required: true,
    description: '',
    example: '2023-12-31T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsString()
  dateOfBirth: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Student Faculty',
  })
  @IsNotEmpty()
  @IsNumber()
  facultyId: number;

  @ApiProperty({
    type: IsNumber,
    required: true,
    description: 'Student Department',
  })
  @IsNotEmpty()
  @IsNumber()
  departmentId: number;

  @ApiProperty({
    type: IsNumber,
    required: true,
    description: 'Student School',
  })
  @IsNotEmpty()
  @IsNumber()
  schoolId: number;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Matric Number',
  })
  @IsNotEmpty()
  matricNumber: string;

  @ApiProperty({
    type: String,
    required: true,
    description: '',
  })
  @IsNotEmpty()
  @IsNumber()
  yearOfAdmission: number;
}
