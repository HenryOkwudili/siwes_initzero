import { Injectable } from '@nestjs/common';
import { BaseDatabaseService } from '@app/core/database/base.db.service';
import { PrismaService } from '@app/core/database/prisma.service';

@Injectable()
export class SchoolDatabaseService extends BaseDatabaseService {
  public fillable = [
    'name',
    'address',
    'bio',
    'logo',
    'regCode',
    'phoneNumber',
    'email',
  ];
  public searchable = ['name', 'email'];
  public relations = [];
  constructor(private readonly prisma: PrismaService) {
    super(prisma.school);
  }
}
