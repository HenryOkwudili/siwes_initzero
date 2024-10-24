import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import config from 'src/core/utils/config';
import { IamModule } from '@app/iam/iam.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { EmailManagementsModule } from './email-managements/email-managements.module';
import { AttendanceSystemModule } from './attendance-system/attendance-system.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    CoreModule,
    UsersModule,
    AccountsModule,
    IamModule,
    MulterModule.register({
      dest: './uploads',
    }),
    /*
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
*/
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    EmailManagementsModule,
    AttendanceSystemModule,
  ],
  providers: [],
})
export class AppModule {}
