import { Module } from '@nestjs/common';
import { CoursesModule } from '@app/attendance-system/courses/courses.module';
import { SchoolModule } from '@app/attendance-system/school/school.module';
import { DepartmentModule } from '@app/attendance-system/department/department.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [CoursesModule, SchoolModule, DepartmentModule, StudentsModule],
})
export class AttendanceSystemModule {}
