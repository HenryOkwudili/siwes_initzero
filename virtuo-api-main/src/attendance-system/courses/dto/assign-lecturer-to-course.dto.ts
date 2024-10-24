import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AssignLecturerToCourseDto {
  @ApiProperty({
    type: Number,
    description: 'ID of the course',
    required: true,
  })
  @IsNumber({}, { message: 'Course ID must be a number' })
  courseId: number;

  @ApiProperty({
    type: Number,
    description: 'ID of the lecturer account',
    required: true,
  })
  @IsNumber({}, { message: 'Lecturer Account ID must be a number' })
  lecturerAccountId: number;
}
