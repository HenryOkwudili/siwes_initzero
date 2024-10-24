import { Injectable } from '@nestjs/common';
import { BaseDatabaseService } from '@app/core/database/base.db.service';
import { PrismaService } from '@app/core/database/prisma.service';

@Injectable()
export class StudentsDatabaseService extends BaseDatabaseService {
  public fillable = [
    'courses',
    'studentAttendance',
    'school',
    'departmentId',
    'level',
    'lastName',
    'firstName',
  ];
  public searchable = ['courses', 'studentAttendance', 'firstName'];
  public relations = [];
  constructor(private readonly prisma: PrismaService) {
    super(prisma.student);
  }
}
