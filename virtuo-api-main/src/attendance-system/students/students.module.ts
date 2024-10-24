import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { StudentsDatabaseService } from './db/students.db.service';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService, StudentsDatabaseService],
})
export class StudentsModule {}
