import { AccountType } from '@prisma/client';
import {
  CreateAdminDto,
  CreateLecturerDto,
  CreateStudentDto,
  CreateSchoolDto,
  UpdateAdminDto,
  UpdateLecturerDto,
  UpdateStudentDto,
  UpdateSchoolDto,
} from '@app/accounts/dto';
import { CreateBusinessOwnerDto } from '@app/accounts/dto/business-owner/create-business-owner.dto';
import { UpdateBusinessOwnerDto } from '@app/accounts/dto/business-owner/update-business-owner.dto';

type Options = {
  fillable: string[];
  relations: string[];
  searchable: string[];
  createDto: any;
  updateDto: any;
};

export type AccountTypeMapping = Record<
  (typeof AccountType)[keyof typeof AccountType],
  Options
>;
export const accountTypeMapping: AccountTypeMapping = {
  [AccountType.ADMIN]: {
    fillable: ['firstName', 'lastName', 'email'],
    relations: [],
    searchable: ['firstName', 'lastName'],
    createDto: CreateAdminDto,
    updateDto: UpdateAdminDto,
  },
  [AccountType.STUDENT]: {
    fillable: [
      'firstName',
      'lastName',
      'email',
      'localGovernment',
      'stateOfOrigin',
      'phone',
      'sex',
      'facultyId',
      'departmentId',
      'schoolId',
      'level',
      'yearOfAdmission',
      'matricNumber',
      'dateOfBirth',
      'linkedinUrl',
      'facebookUrl',
      'xUrl',
      'passport',
    ],
    relations: [],
    searchable: ['firstName', 'lastName', 'level', 'matricNumber'],
    createDto: CreateStudentDto,
    updateDto: UpdateStudentDto,
  },
  [AccountType.LECTURER]: {
    fillable: ['firstName', 'lastName', 'email', 'position', 'schoolId'],
    relations: [''],
    searchable: ['email'],
    createDto: CreateLecturerDto,
    updateDto: UpdateLecturerDto,
  },
  [AccountType.BUSINESS_OWNER]: {
    fillable: ['firstName', 'lastName', 'email', 'companyName', 'phone'],
    searchable: ['name'],
    relations: [],
    createDto: CreateBusinessOwnerDto,
    updateDto: UpdateBusinessOwnerDto,
  },
  [AccountType.SCHOOL]: {
    fillable: [
      'name',
      'address',
      'bio',
      'logo',
      'phoneNumber',
      'email',
      'regCode',
      'schoolType',
    ],
    relations: [],
    searchable: ['name', 'address', 'phoneNumber', 'email'],
    createDto: CreateSchoolDto,
    updateDto: UpdateSchoolDto,
  },
};
