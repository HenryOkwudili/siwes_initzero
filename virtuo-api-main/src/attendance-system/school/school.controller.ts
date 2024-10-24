import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { SchoolService } from './school.service';
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
import { UpdateSchoolDto } from '@app/attendance-system/school/dto/update-school.dto';
import { Public } from '@app/iam/decorators';

const BASE_PATH = 'school';
@Controller(BASE_PATH)
@ApiTags(BASE_PATH)
export class SchoolController {
  constructor(private readonly SchoolsService: SchoolService) {}

  @Accounts(AccountType.ADMIN)
  @ApiFilterPagination('Get all Schools')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    return await this.SchoolsService.getAllSchool(
      filterOptions,
      paginationOptions,
    );
  }

  @Accounts(AccountType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Get One School')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Get(':code')
  findOne(@Param('name') code: string) {
    return this.SchoolsService.findOne(code);
  }

  @Accounts(AccountType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update School Info',
    description: '',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateSchoolDto: UpdateSchoolDto) {
    return this.SchoolsService.update(+id, updateSchoolDto);
  }

  @Accounts(AccountType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete School',
    description: 'Delete School',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.SchoolsService.delete(parseInt(id));
  }
}
