import { AccountDatabaseService } from '@app/accounts/accounts.db.service';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as XLSX from 'xlsx';
import { UserService } from '@app/users/users.service';
import { REQUEST_USER_KEY } from '@app/iam/iam.constants';
import { PrismaService } from '@app/core/database/prisma.service';
import { AccountType, Prisma, StudentType } from '@prisma/client';
import { generateRandomDigits } from '@app/core/utils/functions';
import { EmailManagementsService } from '@app/email-managements/email-managements.service';
import { ValidationException } from '@app/core/utils/errors/http-error.filter';
import { CreateStudentDto } from './dto';
import { CreateStudentFromExcelDto } from './dto/student/create-student-from-svg.dto';
import { CurrentUserData } from '@app/iam/interfaces';
import { isValid, parseISO } from 'date-fns';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class AccountsService {
  constructor(
    private readonly accountsDbService: AccountDatabaseService,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly mailService: EmailManagementsService,
  ) {}
  async findAll(filterOptions, paginationOptions) {
    if (
      filterOptions.type &&
      Object.keys(AccountType).includes(filterOptions.type)
    ) {
      const [data, totalCount] = await this.accountsDbService.findAll(
        filterOptions,
        paginationOptions,
      );
      return { data, totalCount };
    }

    throw new ValidationException({
      type: 'Account type is required',
    });
  }

  async findOne(id: number) {
    const account = await this.accountsDbService.findById(id);
    const accountTypeData = await this.accountsDbService.findAccountTypeData(
      account.id,
      account.type,
    );

    return {
      [account.type.toLowerCase()]: accountTypeData,
    };
  }

  async create(data, tx?: Prisma.TransactionClient) {
    let userData;
    // console.log('Data received in AccountsService.create:', data);
    const accountData = {
      ...data,
      email: data.email.toLowerCase(),
    };
    // console.log('Account Data', accountData);
    if ([AccountType.SCHOOL].includes(accountData.accountType)) {
      const existSchoolRegNo = await this.prismaService.school.findFirst({
        where: {
          regCode: data.regCode,
          email: data.email,
        },
      });
      if (existSchoolRegNo) {
        throw new BadRequestException(
          `School Registration Number with: ${data.regCode} already exist`,
        );
      }
      accountData['name'] = data.name.toUpperCase();
      userData = {
        ...accountData,
        firstName: accountData.name,
        lastName: accountData.regCode,
        status: true,
      };
    } else {
      accountData['firstName'] = data.firstName.toUpperCase();
      accountData['lastName'] = data.lastName.toUpperCase();
    }

    try {
      return await this.prismaService.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const userData = {
            sex: accountData.sex,
            email: accountData.email,
            firstName: accountData.firstName ?? accountData.name,
            lastName: accountData.lastName ?? accountData.regCode,
            status: accountData.status ?? true,
          };
          const user = await this.userService.create(userData, tx);
          const account = await this.accountsDbService.create(
            { ...accountData, userId: user.id },
            tx,
          );
          this.mailService.sendMailOnSandBox(
            { subject: 'Verification Code', to: data.email.toLowerCase() },
            await this.generateCode(account.id),
          );
        },
      );
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint failed

        if (e.code === 'P2002') {
          throw new BadRequestException('User already exists');
        }
      }

      if (e instanceof ConflictException) {
        throw new BadRequestException('User already exists');
      }

      console.log(e);
      throw new BadRequestException('Something went wrong');
    }
  }

  async update(id: number, data) {
    /*if (profilePicture) {
      await this.documentsService.deleteDocumentFileByFileable(
        id,
        FILEABLE_TYPE,
      );
      await this.documentsService.createDocumentFile(
        [profilePicture],
        id,
        FILEABLE_TYPE,
      );
    }*/
    return this.accountsDbService.update(id, data);
  }

  public async verifyCode(code: string) {
    const verify = await this.prismaService.verificationCode.findFirst({
      where: {
        code: code,
        completed: false,
      },
    });
    if (!verify) {
      throw new BadRequestException('Invalid code');
    }
    //const account = await this.userService.findOne(verify.accountId);
    await this.prismaService.verificationCode.update({
      where: {
        code: code,
      },
      data: {
        completed: true,
      },
    });
    await this.userService.update(verify.accountId, { isActivated: true });
    // const data = {
    //   email: account.email,
    // };
    // this.sendNotification(account.type, data);
  }

  private async generateCode(accountId: any) {
    const code = generateRandomDigits(6);
    await this.prismaService.verificationCode.create({
      data: {
        code,
        accountId: accountId,
      },
    });
    return code;
  }

  // Create multiple students from Excel sheet
  async createStudentsFromExcel(
    fileBuffer: Buffer,
    req: Request,
  ): Promise<string> {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const studentsData: CreateStudentFromExcelDto[] = XLSX.utils.sheet_to_json(
      worksheet,
    ) as CreateStudentFromExcelDto[];

    // Authorization check
    // const user: CurrentUserData | undefined = req[REQUEST_USER_KEY];
    // if (!user || user.account.type !== AccountType.ADMIN) {
    //   throw new ForbiddenException(
    //     "You do not have permission to perform this action",
    //   );
    // }

    const createdStudents: any[] = [];
    const failedStudents: any[] = [];

    for (const studentData of studentsData) {
      await this.prismaService.$transaction(async (tx) => {
        try {
          const createdStudent = await this.create(
            {
              accountType: AccountType.STUDENT,
              // studentType: "SECONDARY",
              ...studentData,
              isActivated: true,
            },
            tx,
          );
          createdStudents.push(createdStudent);
        } catch (error) {
          console.error(`Error creating student: ${studentData.email}`, error);
          failedStudents.push(studentData);
          throw error;
        }
      });
    }

    if (failedStudents.length === 0) {
      return `${createdStudents.length} students created successfully.`;
    } else {
      return `${createdStudents.length} students created successfully. The following students failed: ${failedStudents.map((s) => s.email).join(', ')}`;
    }
  }

  /*
  private sendNotification(accountType: string, data: any) {
    switch (accountType) {
      case AccountType.OPERATOR:
        this.mailService.sendMail(
          {
            to: data.email,
            context: {
              first_name: data.firstName,
              last_name: data.lastName,
            },
          },
          'operator-welcome-message',
        );
        break;
      case AccountType.COMPANY:
        this.mailService.sendMail(
          {
            to: data.email,
            context: {
              first_name: data.firstName,
              last_name: data.lastName,
            },
          },
          'service-company-welcome-message',
        );
        break;
      case AccountType.AGENCY:
        this.mailService.sendMail(
          {
            to: data.email,
            context: {
              first_name: data.firstName,
              last_name: data.lastName,
            },
          },
          'ncdmb-user-welcome-message',
        );
        break;
      default:
        this.mailService.sendMail(
          {
            to: data.email,
            context: {
              email: data.email,
              first_name: data.firstName,
              last_name: data.lastName,
            },
          },
          'individual-welcome-message',
        );
    }
  }
*/
}
