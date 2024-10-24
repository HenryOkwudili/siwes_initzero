import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class MarkAttendanceDto {
  @ApiProperty({
    type: Number,
    description: 'ID of the Class',
    required: true,
  })
  @IsNumber({}, { message: 'Student ID must be a number' })
  classId: number;

  @ApiProperty({
    type: Number,
    description: 'ID of the Student',
    required: true,
  })
  @IsNumber({}, { message: 'Student ID must be a number' })
  studentId: number;
}
