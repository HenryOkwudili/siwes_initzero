import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccountsService } from '@app/accounts/accounts.service';
import { Accounts } from '@app/accounts/decorators/accounts.decorator';
import { AccountType } from '@prisma/client';
import { CurrentUser } from '@app/iam/decorators';
import { CurrentUserData } from '@app/iam/interfaces';
import { ApiAccountUpdate } from './decorators';
import { AccountValidationPipe, HandlerAction } from './pipes/account-validation.pipe';

@Controller('account')
@Accounts(
  AccountType.ADMIN,
  AccountType.BUSINESS_OWNER,
  AccountType.LECTURER,
  AccountType.STUDENT,
)
@ApiTags('account')
export class AccountProfileController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Authenticated Account Profile',
  })
  async findOne(@CurrentUser() user: CurrentUserData) {
    return await this.accountsService.findOne(user.account?.id);
  }



  @ApiAccountUpdate()
  @Patch()
  async update(
    @Body(AccountValidationPipe(HandlerAction.UPDATE))
    updateAccountDto,
    @CurrentUser() user: CurrentUserData,
  ) {
    return await this.accountsService.update(user.account.id, updateAccountDto);
  }

}
