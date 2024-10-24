import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Level } from '@prisma/client';

export class CreateCourseDto {
  @ApiProperty({
    type: String,
    description: 'Course title',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Course code',
  })
  @IsString({ message: 'Invalid character' })
  code: string;

  @ApiProperty({
    enum: Level,
    required: true,
    description: 'Level',
  })
  @IsString({ message: 'Invalid character' })
  level: Level;
}
