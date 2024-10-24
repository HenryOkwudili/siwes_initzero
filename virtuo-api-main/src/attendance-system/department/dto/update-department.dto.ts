import { PartialType } from '@nestjs/swagger';
import { CreateDepartmentDto } from '@app/attendance-system/department/dto/create-department.dto';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
