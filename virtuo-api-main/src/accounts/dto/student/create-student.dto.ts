import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AccountType, Level, Sex } from '@prisma/client';
import { CreateAccountDto } from '@app/accounts/dto/create-account.dto';
import { Transform } from 'class-transformer';

export class CreateStudentDto extends PickType(CreateAccountDto, [
  'accountType',
]) {
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
  sex: string;

  @ApiProperty({
    enum: Level,
  })
  @IsNotEmpty()
  level: string;

  @ApiProperty({
    type: Date,
  })
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiProperty({
    type: IsNumber,
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

  @ApiProperty({
    type: String,
    required: false,
    description: '',
  })
  @IsString()
  xUrl: string;
  @ApiProperty({
    type: String,
    required: false,
    description: '',
  })
  @IsString()
  linkedinUrl: string;
  @ApiProperty({
    type: String,
    required: false,
    description: '',
  })
  @IsString()
  facebookUrl: string;
}
