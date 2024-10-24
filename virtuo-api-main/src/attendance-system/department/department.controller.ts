import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Accounts } from '@app/accounts/decorators/accounts.decorator';
import { AccountType } from '@prisma/client';
import {
  ApiEndpoint,
  FiltersQuery,
  PaginationQuery,
} from '@app/core/decorators';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/pagination/pagination.interceptor';
import { CreateDepartmentDto } from '@app/attendance-system/department/dto/create-department.dto';
import { UpdateDepartmentDto } from '@app/attendance-system/department/dto/update-department.dto';

const BASE_PATH = 'department';
@Controller(BASE_PATH)
@ApiTags(BASE_PATH)
export class DepartmentController {
  constructor(private readonly DepartmentsService: DepartmentService) {}
  @Accounts(AccountType.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Add Department')
  @ApiResponse({
    status: 201,
    description: 'Department Created Successfully',
  })
  @Post()
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.DepartmentsService.create(createDepartmentDto);
  }

  @Accounts(AccountType.ADMIN)
  @ApiFilterPagination('Get all Departments')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    return await this.DepartmentsService.getAllDepartment(
      filterOptions,
      paginationOptions,
    );
  }

  @Accounts(AccountType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Get One Department')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Get(':code')
  findOne(@Param('name') code: string) {
    return this.DepartmentsService.findOne(code);
  }

  @Accounts(AccountType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Department Info',
    description: '',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.DepartmentsService.update(+id, updateDepartmentDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete Email Template',
    description: 'Delete Any Template Data',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.DepartmentsService.delete(parseInt(id));
  }
}
