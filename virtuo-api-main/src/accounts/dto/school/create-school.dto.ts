import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { AccountType, SchoolType } from '@prisma/client';
import { CreateAccountDto } from '@app/accounts/dto/create-account.dto';
import { Transform } from 'class-transformer';

export class CreateSchoolDto extends PickType(CreateAccountDto, [
  'accountType',
]) {
  @ApiProperty({
    enum: AccountType,
  })
  accountType: AccountType;

  @ApiProperty({
    enum: SchoolType,
    description: 'School Type (SECONDARY or TERTIARY)',
  })
  @IsNotEmpty()
  schoolType: string;

  @ApiProperty({
    type: String,
    description: 'School Email',
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
  

  @ApiProperty({
    type: String,
    description: 'School Name',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Registration code',
  })
  @IsNotEmpty()
  regCode: string;

  @ApiProperty({
    type: String,
    description: 'School Address',
  })
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    type: String,
    description: 'School PHone Number',
  })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    type: String,
    description: 'School Bio',
  })
  @IsNotEmpty()
  bio: string;

  @ApiProperty({
    type: String,
    description: 'School Logo',
  })
  @IsNotEmpty()
  logo: string;

 
}
