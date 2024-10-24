import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
  UseInterceptors,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiEndpoint,
  FiltersQuery,
  PaginationQuery,
} from '@app/core/decorators';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/pagination/pagination.interceptor';
import { CreateCourseDto } from '@app/attendance-system/courses/dto/create-course.dto';
import { UpdateCourseDto } from '@app/attendance-system/courses/dto/update-course.dto';
import { Public } from '@app/iam/decorators';
import { AssignLecturerToCourseDto } from './dto/assign-lecturer-to-course.dto';
import { AssignStudentToCourseDto } from './dto/assign-student-to-course.dto';
import { CreateClassForCourseDto } from './dto/create-class-for-course.dto';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

const BASE_PATH = 'courses';
@Controller(BASE_PATH)
@ApiTags(BASE_PATH)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}
  //@Accounts(AccountType.ADMIN)
  // Endpoint to mark new attentance
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Mark attendance')
  @ApiResponse({
    status: 201,
    description: 'Attendance successfully submitted',
  })
  @Post('mark-attendance')
  markAttendance(@Body() markAttendanceDto: MarkAttendanceDto) {
    return this.coursesService.markAttendance(markAttendanceDto);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Add Course')
  @ApiResponse({
    status: 201,
    description: 'Course Created Successfully',
  })
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  // Endpoint to export attendance sheet
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Export Student Attendance')
  @ApiResponse({
    status: 200,
    description: 'CSV file with student attendance exported successfully',
  })
  @Get('export-attendance')
  async exportStudentAttendance(
    @Query('classId') classId: string,
  ): Promise<StreamableFile> {
    try {
      return await this.coursesService.exportStudentAttendance(classId);
    } catch (error) {
      throw new BadRequestException(
        'Error exporting attendance data: ' + error.message,
      );
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Get lecturer courses')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Get('lecturer/:id')
  getLecturerCourse(@Param('id') id: number) {
    console.log(id);
    return this.coursesService.getLecturerCourses(+id);
  }

  @ApiFilterPagination('Get all Courses')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    return await this.coursesService.getAllCourses(
      filterOptions,
      paginationOptions,
    );
  }

  // @Accounts(AccountType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Get One Course')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.coursesService.findOne(code);
  }

  // @Accounts(AccountType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Course Info',
    description: '',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(+id, updateCourseDto);
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
    return this.coursesService.delete(parseInt(id));
  }
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Assign Lecturer')
  @ApiResponse({
    status: 201,
    description: '',
  })
  @Post('assign-lecturer')
  assignLecturerToCourse(
    @Body() assignLecturerToCourseDto: AssignLecturerToCourseDto,
  ) {
    return this.coursesService.assignLecturerToCourse(
      assignLecturerToCourseDto,
    );
  }
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Assign Student')
  @ApiResponse({
    status: 201,
    description: '',
  })
  @Post('assign-student')
  assignStudentToCourse(
    @Body() assignStudentToCourseDto: AssignStudentToCourseDto,
  ) {
    return this.coursesService.assignStudentToCourse(assignStudentToCourseDto);
  }
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('create classes for course')
  @ApiResponse({
    status: 201,
    description: '',
  })
  @Post('create-class')
  createClassForCourse(
    @Body() createClassForCourseDto: CreateClassForCourseDto,
  ) {
    return this.coursesService.createCourseClass(createClassForCourseDto);
  }
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Get attendance')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Get('class/:classId')
  getAttendance(@Param('classId') classId: number) {
    return this.coursesService.getClassAttendance(+classId);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Get Class of a course')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Get('classes/:classId')
  getClasses(@Param('classId') classId: number) {
    return this.coursesService.getAClass(+classId);
  }
}
