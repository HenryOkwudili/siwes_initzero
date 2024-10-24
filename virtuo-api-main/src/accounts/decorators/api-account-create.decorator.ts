import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';

import { AccountType } from '@prisma/client';
import {
  CreateAdminDto,
  CreateLecturerDto,
  CreateStudentDto,
} from '@app/accounts/dto';

export const ApiAccountCreate = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create an Account',
      description: `Creates an account based on an account type( ${Object.values(
        AccountType,
      ).join(', ')})`,
    }),
    ApiExtraModels(CreateStudentDto, CreateAdminDto, CreateLecturerDto),
    ApiBody({
      schema: {
        oneOf: [
          {
            $ref: getSchemaPath(CreateStudentDto),
          },
          {
            $ref: getSchemaPath(CreateAdminDto),
          },
          {
            $ref: getSchemaPath(CreateLecturerDto),
          },
        ],
      },
    }),
  );
