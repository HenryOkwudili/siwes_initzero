import { forwardRef, Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AccountDatabaseService } from '@app/accounts/accounts.db.service';
import { AccountsPublicController } from '@app/accounts/accounts-public.controller';
import { AccountProfileController } from '@app/accounts/account-profile.controller';
import { UsersModule } from '@app/users/users.module';
import { EmailManagementsModule } from '@app/email-managements/email-managements.module';

@Module({
  controllers: [
    AccountsController,
    AccountsPublicController,
    AccountProfileController,
  ],
  providers: [AccountDatabaseService, AccountsService],
  exports: [AccountsService, AccountDatabaseService],
  imports: [forwardRef(() => UsersModule), EmailManagementsModule],
})
export class AccountsModule {}
