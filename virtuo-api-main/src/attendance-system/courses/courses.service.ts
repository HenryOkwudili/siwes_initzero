import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { CoursesDatabaseService } from '@app/attendance-system/courses/db/courses.db.service';
import { PrismaService } from '@app/core/database/prisma.service';
import { createObjectCsvStringifier } from 'csv-writer';
import * as csv from 'fast-csv';
import { PassThrough } from 'stream';

@Injectable()
export class CoursesService {
  constructor(
    private readonly coursesDbService: CoursesDatabaseService,
    private readonly prismaService: PrismaService,
  ) {}

  async getAllCourses(filterOptions, paginationOptions) {
    const [data, totalCount] = await this.coursesDbService.findAll(
      filterOptions,
      paginationOptions,
    );
    return { data, totalCount };
  }
  async create(data) {
    return await this.coursesDbService.create(data);
  }

  async findOne(courseCode: string) {
    return await this.coursesDbService.findFirst({ code: courseCode }, [
      'lecturer.lecturer',
      'lecturer.lecturer.school',
      'students',
      'classes',
      'classes.classAttendance',
      'classes.classAttendance.student',
    ]);
  }

  async update(id, data) {
    return await this.coursesDbService.update(id, data);
  }

  async delete(id) {
    return await this.coursesDbService.delete(id);
  }

  // async assignLecturerToCourse(data) {
  //   return this.prismaService.courseLecturer.create({
  //     data: {
  //       courseId: data.courseId,
  //       lecturerId: data.lecturerAccountId,
  //     },
  //   });
  // }

  async assignLecturerToCourse(data) {
    const existingAssignment =
      await this.prismaService.courseLecturer.findFirst({
        where: {
          courseId: data.courseId,
        },
      });

    if (existingAssignment) {
      throw new BadRequestException('Course is already assigned to a lecturer');
    }

    return this.prismaService.courseLecturer.create({
      data: {
        courseId: data.courseId,
        lecturerId: data.lecturerAccountId,
      },
    });
  }

  async getLecturerCourses(lecturerId: number) {
    return this.prismaService.courseLecturer.findMany({
      where: {
        lecturerId: lecturerId,
      },
      include: {
        course: true,
      },
    });
  }

  async assignStudentToCourse(data) {
    return this.prismaService.courseStudent.create({
      data: {
        courseId: data.courseId,
        studentId: data.studentId,
      },
    });
  }

  async createCourseClass(data) {
    return this.prismaService.courseClass.create({
      data: {
        courseId: data.courseId,
        startTime: data.startTime,
        endTime: data.endTime,
        day: data.day,
      },
    });
  }
  async markAttendance(data) {
    const check = await this.prismaService.classAttendance.findFirst({
      where: {
        classId: data.classId,
        studentId: data.studentId,
        attended: true,
      },
    });
    if (check) {
      throw new BadRequestException('Student has been marked present');
    }
    return this.prismaService.classAttendance.create({
      data: {
        classId: data.classId,
        studentId: data.studentId,
        attended: true,
      },
    });
  }
  async getClassAttendance(classId: number) {
    return this.prismaService.classAttendance.findMany({
      where: {
        classId,
      },
      include: {
        student: true,
        class: {
          include: {
            course: {
              include: {
                lecturer: {
                  include: {
                    lecturer: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getAClass(classId) {
    return this.prismaService.courseClass.findFirst({
      where: {
        id: classId,
      },
      include: {
        course: {
          include: {
            students: true,
            classes: {
              include: {
                classAttendance: { include: { student: true } },
              },
            },
          },
        },
      },
    });
  }

  async exportStudentAttendance(classId: string): Promise<StreamableFile> {
    try {
      const parsedClassId = parseInt(classId, 10);
      if (isNaN(parsedClassId)) {
        throw new Error('Invalid classId provided');
      }

      const attendanceRecords =
        await this.prismaService.classAttendance.findMany({
          where: { classId: parsedClassId },
          include: { student: true },
        });

      if (attendanceRecords.length === 0) {
        throw new NotFoundException('No attendance available for the course');
      }

      const csvStream = csv.format({ headers: true });
      attendanceRecords.forEach((record) => {
        csvStream.write({
          StudentName: `${record.student.firstName} ${record.student.lastName}`,
          AttendanceDate: record.createdAt,
          Status: record.attended ? 'Present' : 'Absent',
        });
      });
      csvStream.end();

      const passThroughStream = new PassThrough();
      csvStream.pipe(passThroughStream);

      return new StreamableFile(passThroughStream, {
        type: 'text/csv',
        disposition: `attachment; filename=student-attendance-class-${parsedClassId}.csv`,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error exporting attendance data: ' + error.message);
    }
  }
}
