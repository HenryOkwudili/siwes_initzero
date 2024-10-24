import { Injectable } from '@nestjs/common';
import { DepartmentDatabaseService } from '@app/attendance-system/department/db/department.db.service';

@Injectable()
export class DepartmentService {
  constructor(private readonly departmentDbService: DepartmentDatabaseService) {}

  async getAllDepartment(filterOptions, paginationOptions) {
    const [data, totalCount] = await this.departmentDbService.findAll(
      filterOptions,
      paginationOptions,
    );
    return { data, totalCount };
  }
  async create(data) {
    return await this.departmentDbService.create(data);
  }

  async findOne(departmentName: string) {
    return await this.departmentDbService.findFirst({ code: departmentName });
  }

  async update(id, data) {
    return await this.departmentDbService.update(id, data);
  }

  async delete(id) {
    return await this.departmentDbService.delete(id);
  }
}
