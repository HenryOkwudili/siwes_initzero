import { Injectable } from '@nestjs/common';
import { BaseDatabaseService } from '@app/core/database/base.db.service';
import { PrismaService } from '@app/core/database/prisma.service';

@Injectable()
export class DepartmentDatabaseService extends BaseDatabaseService {
  public fillable = ['name', 'facultyId', 'schoolId'];
  public searchable = ['name'];
  public relations = [];
  constructor(private readonly prisma: PrismaService) {
    super(prisma.course);
  }
}
