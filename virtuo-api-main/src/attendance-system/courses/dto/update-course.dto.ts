import { PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from '@app/attendance-system/courses/dto/create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
