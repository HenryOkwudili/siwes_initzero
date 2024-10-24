import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsISO8601 } from 'class-validator';

export class CreateClassForCourseDto {
  @ApiProperty({
    type: Number,
    description: 'ID of the course',
    required: true,
  })
  @IsNumber({}, { message: 'Course ID must be a number' })
  courseId: number;

  @ApiProperty({
    type: String,
    description: 'Day of the class',
    required: true,
  })
  @IsString({ message: 'Day must be a string' })
  day: string;

  @ApiProperty({
    type: String,
    description: 'Start time of the class in ISO 8601 format',
    required: true,
  })
  @IsISO8601({}, { message: 'Start time must be in ISO 8601 format (e.g., 2022-04-25T09:30:00Z)' })
  startTime: string;

  @ApiProperty({
    type: String,
    description: 'End time of the class in ISO 8601 format',
    required: true,
  })
  @IsISO8601({}, { message: 'End time must be in ISO 8601 format (e.g., 2022-04-25T09:30:00Z)' })
  endTime: string;
}
