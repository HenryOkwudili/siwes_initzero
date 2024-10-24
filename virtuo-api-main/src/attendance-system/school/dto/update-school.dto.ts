import { PartialType } from '@nestjs/swagger';
import { CreateSchoolDto } from '@app/attendance-system/school/dto/create-school.dto';

export class UpdateSchoolDto extends PartialType(CreateSchoolDto) {}
