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
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiEndpoint,
  FiltersQuery,
  PaginationQuery,
} from '@app/core/decorators';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/pagination/pagination.interceptor';
import { Public } from '@app/iam/decorators';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Level, Sex } from '@prisma/client';

const BASE_PATH = 'students';
@Controller(BASE_PATH)
@ApiTags(BASE_PATH)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Get lecturer Students by Passing courseId as Query')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @ApiFilterPagination('Get all Students')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @Query('courseId') courseId: number | number[], // Required, allows single or multiple values
    @PaginationQuery() paginationOptions: any, // Kept paginationOptions required
    @Query('level') levels?: Level[],
    @Query('departmentId') departmentIds?: number[],
    @Query('attendance') attendance?: string,
    @Query('isPresent') isPresent?: string,
    @Query('attendanceRateBelow70') attendanceRateBelow70?: boolean,
    @Query('attendanceRateAbove70') attendanceRateAbove70?: boolean,
    @Query('sex') sex?: Sex,
  ) {
    // Ensure courseId is an array
    if (!Array.isArray(courseId)) {
      courseId = [courseId];
    }

    // Create filterOptions object with ALL parameters, defaulting optionals
    const filterOptions = {
      courseId,
      level: levels || [], // Default to empty array if not provided
      departmentId: departmentIds || [],
      attendance,
      attendanceRateAbove70,
      attendanceRateBelow70,
      isPresent: isPresent !== undefined ? isPresent === 'true' : undefined, // Convert to boolean if provided
      sex,
    };

    return await this.studentsService.getAllStudents(
      filterOptions,
      paginationOptions,
    );
  }
}
