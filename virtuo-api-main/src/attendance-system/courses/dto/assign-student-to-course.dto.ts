import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AssignStudentToCourseDto {
  @ApiProperty({
    type: Number,
    description: 'ID of the course',
    required: true,
  })
  @IsNumber({}, { message: 'Course ID must be a number' })
  courseId: number;

  @ApiProperty({
    type: Number,
    description: 'ID of the Student',
    required: true,
  })
  @IsNumber({}, { message: 'Student ID must be a number' })
  studentId: number;
}
