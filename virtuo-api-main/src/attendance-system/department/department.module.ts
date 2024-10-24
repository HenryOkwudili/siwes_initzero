import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { DepartmentDatabaseService } from '@app/attendance-system/department/db/department.db.service';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService, DepartmentDatabaseService],
})
export class DepartmentModule {}
