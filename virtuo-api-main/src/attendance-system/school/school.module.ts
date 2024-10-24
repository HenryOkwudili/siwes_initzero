import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { SchoolDatabaseService } from '@app/attendance-system/school/db/school.db.service';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService, SchoolDatabaseService],
})
export class SchoolModule {}
