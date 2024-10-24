import { Injectable } from '@nestjs/common';
import { BaseDatabaseService } from '@app/core/database/base.db.service';
import { PrismaService } from '@app/core/database/prisma.service';

@Injectable()
export class CoursesDatabaseService extends BaseDatabaseService {
  public fillable = ['code', 'title', 'level'];
  public searchable = ['code'];
  public relations = [];
  constructor(private readonly prisma: PrismaService) {
    super(prisma.course);
  }
}
