import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Accounts } from '@app/accounts/decorators/accounts.decorator';
import { AccountType } from '@prisma/client';

import { EmailManagementsService } from '@app/email-managements/email-managements.service';
import {
  ApiEndpoint,
  FiltersQuery,
  PaginationQuery,
} from '@app/core/decorators';
import { CreateEmailTemplateDto } from '@app/email-managements/dto/create-email-template.dto';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/pagination/pagination.interceptor';
import { UpdateEmailTemplatesDto } from '@app/email-managements/dto/update-email-templates.dto';

const BASE_PATH = 'email-templates';

@Controller('mail')
@ApiTags(BASE_PATH)
export class EmailManagementsController {
  constructor(private readonly mailService: EmailManagementsService) {}

  @Accounts(AccountType.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiEndpoint('Create Mail Template')
  @ApiResponse({
    status: 201,
    description: 'Mail Template Created Successfully',
  })
  @Post()
  create(@Body() createEmailTemplateDto: CreateEmailTemplateDto) {
    return this.mailService.create(createEmailTemplateDto);
  }

  @Accounts(AccountType.ADMIN)
  @ApiFilterPagination('Get all Email Templates')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    return await this.mailService.findAll(filterOptions, paginationOptions);
  }

  @Accounts(AccountType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiEndpoint('Get One Email template')
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.mailService.findOne(slug);
  }

  @Accounts(AccountType.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Email Template',
    description: 'Update Any Template Data',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateEmailTemplatesDto: UpdateEmailTemplatesDto,
  ) {
    return this.mailService.update(+id, updateEmailTemplatesDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete Email Template',
    description: 'Delete Any Template Data',
  })
  @ApiResponse({
    status: 200,
    description: 'Ok',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mailService.delete(parseInt(id));
  }
}
