import { AccountType, Level, Prisma, PrismaClient, Sex, StudentType } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltOrRounds = 15;
export default class UsersSeeder {
  static async run() {
    try {
      return await Promise.all([
        this.createAdminAccount(),
        this.createBusinessOwnerAccount(),
        this.createSchoolAccount(),
        this.createLecturerAccount(),
        this.createStudentAccount(),
      ]);
    } catch (e) {
      console.log(e);
    }
  }

  static async createAccount(accountType, userData, accountData) {
    const uniqueUser = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (uniqueUser) {
      return;
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const user = await tx.user.create({
        data: {
          ...userData,
          password: await bcrypt.hash('password', saltOrRounds),
          isActivated: true,
        },
      });

      await tx.account.create({
        data: {
          type: accountType,
          [accountType.toLowerCase()]: {
            create: accountData,
          },
          users: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    });
  }

  static async createAdminAccount() {
    const userData: Omit<Prisma.UserCreateInput, 'isActivated' | 'password'> = {
      firstName: 'SUPER',
      lastName: 'ADMIN',
      email: 'super_admin@virtuo.com',
    };

    const accountData: Prisma.AdminCreateWithoutAccountInput = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
    };
    return this.createAccount(AccountType.ADMIN, userData, accountData);
  }
  static async createSchoolAccount() {
    const userData: Omit<Prisma.UserCreateInput, 'isActivated' | 'password'> = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.helpers.unique(faker.internet.email),
    };

    const accountData: Prisma.SchoolCreateWithoutAccountInput = {
      address: faker.location.streetAddress(),
      phoneNumber: faker.phone.number(),
      regCode: '36367272',
      name: userData.firstName,
      email: userData.email,
      status: true,
      schoolType: 'TERTIARY',
    };
    return this.createAccount(AccountType.SCHOOL, userData, accountData);
  }
  static async createStudentAccount() {
    const accounts = [];
    let index = 0;

    do {
      const userData: Omit<Prisma.UserCreateInput, 'isActivated' | 'password'> =
        {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.helpers.unique(faker.internet.email),
        };

      const accountData: Prisma.StudentCreateWithoutAccountInput = {
        studentType: StudentType.TERTIARY,
        dateOfBirth: new Date(),
        departmentId: 1,
        email: faker.helpers.unique(faker.internet.email),
        facultyId: 1,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        level: Level.HUNDRED,
        matricNumber: `sci/18/19/${index + 2000}`,
        phone: faker.phone.number(),
        school: {
          connect: {
            accountId: 4,
          },
        },
        sex: Sex.MALE,
        stateOfOrigin: faker.location.state(),
        yearOfAdmission: 2020,
        localGovernment: faker.location.streetAddress(),
      };
      const createdAccount = await this.createAccount(
        AccountType.STUDENT,
        userData,
        accountData,
      );
      accounts.push(createdAccount);
      index++;
    } while (index < 100);
    return accounts;
  }
  static async createLecturerAccount() {
    const userData: Omit<Prisma.UserCreateInput, 'isActivated' | 'password'> = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.helpers.unique(faker.internet.email),
    };

    const accountData: Prisma.LecturerCreateWithoutAccountInput = {
      school: {
        connect: {
          accountId: 4,
        },
      },
      position: 'HOD',
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
    };
    return this.createAccount(AccountType.LECTURER, userData, accountData);
  }
  static async createBusinessOwnerAccount() {
    const userData: Omit<Prisma.UserCreateInput, 'isActivated' | 'password'> = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.helpers.unique(faker.internet.email),
    };

    const accountData: Prisma.BusinessOwnerCreateWithoutAccountInput = {
      companyName: faker.company.name(),
      phone: faker.phone.number(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
    };
    return this.createAccount(
      // AccountType.BUSINESS_OWNER,
      AccountType.STUDENT,
      userData,
      accountData,
    );
  }
}
