import { Level, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const courseDumps = [
  {
    title: 'English',
    code: 'ENG101',
    level: Level.HUNDRED,
  },
  {
    title: 'Mathematics',
    code: 'MTH101',
    level: Level.HUNDRED,
  },
  {
    title: 'Physics',
    code: 'PHY101',
    level: Level.TWOHUNDRED,
  },
  {
    title: 'Chemistry',
    code: 'CHM101',
    level: Level.HUNDRED,
  },
  {
    title: 'Biology',
    code: 'BIO101',
    level: Level.HUNDRED,
  },
];

export default class CoursesSeeder {
  static async run() {
    return Promise.all(
      courseDumps.map(async (data) => {
        return prisma.course.upsert({
          where: {
            code: data.code,
          },
          update: {},
          create: data,
        });
      }),
    );
  }
}
