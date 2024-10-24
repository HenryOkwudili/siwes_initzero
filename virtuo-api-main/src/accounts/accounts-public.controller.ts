import { AccountsService } from '@app/accounts/accounts.service';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@app/iam/decorators';

@Controller('accounts-public')
@Public()
@ApiTags('accounts-public')
export class AccountsPublicController {
  constructor(private readonly accountsService: AccountsService) {}
  //
  // @ApiEndpoint('Get One Account by ID')
  // @Post('/verify/:code')
  // async verify(@Param('code') code: string) {
  //   return await this.accountsService.verifyCode(code);
  // }
  //
  // @ApiQuery({
  //   name: 'type',
  //   type: 'string',
  //   required: true,
  //   enum: [...Object.keys(AccountType)],
  // })
  // @ApiFilterPagination('Get all Accounts by account type for public')
  // @UseInterceptors(PaginationInterceptor)
  // @Get('')
  // async findAll(
  //   @FiltersQuery() filterOptions,
  //   @PaginationQuery() paginationOptions,
  // ) {
  //   delete filterOptions.accountId;
  //   return await this.accountsService.findAll(filterOptions, paginationOptions);
  // }
  //
  // @ApiEndpoint('Get One Account by ID')
  // @Get(':id')
  // async findOne(@Param('id') id: number) {
  //   return await this.accountsService.findOne(+id);
  // }
}
