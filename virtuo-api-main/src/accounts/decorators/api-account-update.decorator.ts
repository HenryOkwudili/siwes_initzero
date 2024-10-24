import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  UpdateAdminDto,
  UpdateLecturerDto,
  UpdateStudentDto,
} from '@app/accounts/dto';

export const ApiAccountUpdate = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update Authenticated Account Profile',
    }),
    ApiExtraModels(UpdateAdminDto, UpdateLecturerDto, UpdateStudentDto),
    ApiBody({
      schema: {
        oneOf: [
          {
            $ref: getSchemaPath(UpdateAdminDto),
          },
          {
            $ref: getSchemaPath(UpdateLecturerDto),
          },
          {
            $ref: getSchemaPath(UpdateStudentDto),
          },
        ],
      },
    }),
  );
