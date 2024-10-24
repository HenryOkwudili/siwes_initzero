import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Level } from '@prisma/client';

export class CreateDepartmentDto {
  @ApiProperty({
    type: String,
    description: 'Department name',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Department facultyId',
  })
  @IsString({ message: 'Invalid character' })
  facultyId: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'schoolId',
  })
  @IsString({ message: 'Invalid character' })
  schoolId: Level;
}
