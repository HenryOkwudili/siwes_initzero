import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AccountsService } from '@app/accounts/accounts.service';
import { AccountType } from '@prisma/client';
import { ApiFilterPagination } from '@app/core/decorators/api-filter-pagination.decorator';
import { PaginationInterceptor } from '@app/core/pagination/pagination.interceptor';
import { FiltersQuery, PaginationQuery } from '@app/core/decorators';
import { Accounts } from '@app/accounts/decorators/accounts.decorator';
import { ApiAccountCreate, ApiAccountUpdate } from '@app/accounts/decorators';
import {
  AccountValidationPipe,
  HandlerAction,
} from '@app/accounts/pipes/account-validation.pipe';
import { Public } from '@app/iam/decorators';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('accounts')
@ApiTags('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}
  @Public()
  @ApiQuery({
    name: 'type',
    type: 'string',
    required: true,
    enum: [...Object.keys(AccountType)],
  })
  @ApiFilterPagination('Get all Accounts by account type')
  @UseInterceptors(PaginationInterceptor)
  @Get()
  async findAll(
    @FiltersQuery() filterOptions,
    @PaginationQuery() paginationOptions,
  ) {
    return await this.accountsService.findAll(filterOptions, paginationOptions);
  }

  // For creating multiple students from Excel sheet
  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiTags('upload') // Additional tag for file upload
  @ApiOperation({ summary: 'Upload Excel file for bulk student creation' })
  @ApiConsumes('multipart/form-data') // Specify the content type
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadExcel(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const message = await this.accountsService.createStudentsFromExcel(
      file.buffer,
      req,
    );
    return { message };
  }

  @Public()
  @ApiAccountCreate()
  @Post()
  async create(
    @Body(AccountValidationPipe(HandlerAction.CREATE))
    createAccountDto: any,
  ) {
    return await this.accountsService.create({
      ...createAccountDto,
      isActivated: true,
    });
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.accountsService.findOne(+id);
  }

  // @Get(':id/stats')
  // @ApiOperation({
  //   summary: 'Get Account Stats',
  // })
  // async findStats(@Param('id') id: number) {
  //   return await this.accountsService.findStats(+id);
  // }
  //

  @Accounts(AccountType.ADMIN)
  @ApiAccountUpdate()
  @Patch(':id')
  async update(
    @Body(AccountValidationPipe(HandlerAction.UPDATE))
    updateAccountDto,
    @Param('id') id: number,
  ) {
    return await this.accountsService.update(+id, updateAccountDto);
  }
}
