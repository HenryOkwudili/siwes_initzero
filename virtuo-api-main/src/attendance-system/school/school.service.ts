import { Injectable } from '@nestjs/common';
import { SchoolDatabaseService } from '@app/attendance-system/school/db/school.db.service';

@Injectable()
export class SchoolService {
  constructor(private readonly schoolDbService: SchoolDatabaseService) {}

  async getAllSchool(filterOptions, paginationOptions) {
    const [data, totalCount] = await this.schoolDbService.findAll(
      filterOptions,
      paginationOptions,
    );
    return { data, totalCount };
  }

  async findOne(schoolName: string) {
    return await this.schoolDbService.findFirst({ name: schoolName });
  }

  async update(id, data) {
    return await this.schoolDbService.update(id, data);
  }

  async delete(id) {
    return await this.schoolDbService.delete(id);
  }
}
