import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from '@app/core/database/prisma.service';
import { StudentsDatabaseService } from './db/students.db.service';
import { Level } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(
    private readonly coursesDbService: StudentsDatabaseService,
    private readonly prismaService: PrismaService,
  ) {}

  async getAllStudents(filterOptions, paginationOptions) {
    const whereClause: any = {};
    const studentWhereClause: any = {};

    if (filterOptions.courseId && filterOptions.courseId.length > 0) {
      whereClause['courseId'] = {
        in: filterOptions.courseId.map((id) => parseInt(id, 10)),
      };
    }

    if (filterOptions.level) {
      const levels = Array.isArray(filterOptions.level)
        ? filterOptions.level
        : [filterOptions.level];

      studentWhereClause.level = {
        in: levels.map((level) => level as Level),
      };
    }

    if (filterOptions.departmentId) {
      const departmentIds = Array.isArray(filterOptions.departmentId)
        ? filterOptions.departmentId
        : [filterOptions.departmentId];

      studentWhereClause.departmentId = {
        in: departmentIds.map((id) => parseInt(id, 10)),
      };
    }

    if (filterOptions.sex) {
      studentWhereClause.sex = filterOptions.sex;
    }

    if (Object.keys(studentWhereClause).length > 0) {
      whereClause['student'] = studentWhereClause;
    }

    const skip = paginationOptions?.skip || 0;
    const take = paginationOptions?.limit || 10;

    const courseStudentRecords =
      await this.prismaService.courseStudent.findMany({
        where: whereClause,
        include: {
          student: true,
          course: {
            include: {
              classes: {
                include: {
                  classAttendance: true,
                },
              },
            },
          },
        },
      });

    const filteredStudents = courseStudentRecords
      .map((record) => {
        const student = record.student;
        const course = record.course;
        const classAttendances = course.classes
          .flatMap((classItem) => classItem.classAttendance)
          .filter((attendance) => attendance.studentId === student.accountId);

        const totalClasses = course.classes.length;
        const attendedClasses = classAttendances.filter(
          (attendance) => attendance.attended,
        ).length;
        const attendanceRate =
          totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;

        if (filterOptions.attendanceRateAbove70 && attendanceRate < 70) {
          return null;
        }

        if (filterOptions.attendanceRateBelow70 && attendanceRate >= 70) {
          return null;
        }

        if (
          filterOptions.isPresent !== undefined &&
          filterOptions.isPresent !== attendedClasses > 0
        ) {
          return null;
        }

        return {
          ...student,
          courses: [course],
          classAttendance: classAttendances,
          attendanceRate: attendanceRate.toFixed(2),
        };
      })
      .filter(Boolean);

    const totalCount = filteredStudents.length;

    const paginatedStudents = filteredStudents.slice(skip, skip + take);

    return { data: paginatedStudents, totalCount };
  }
}
