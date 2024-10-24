import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CoursesDatabaseService } from '@app/attendance-system/courses/db/courses.db.service';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService, CoursesDatabaseService],
})
export class CoursesModule {}
