import { Module } from '@nestjs/common';
import { EmailManagementsService } from './email-managements.service';
import { EmailManagementsController } from './email-managements.controller';
import { EmailManagementDbService } from '@app/email-managements/email-management.db.service';
import { MailerModule } from '@nestjs-modules/mailer';
 
@Module({
  controllers: [EmailManagementsController],
  providers: [EmailManagementsService, EmailManagementDbService],
  exports: [EmailManagementsService, EmailManagementDbService],
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({ 
        transport: {
          host: process.env.MAIL_HOST,
          port: parseInt(process.env.MAIL_PORT),
          secure: false,
          ignoreTLS: false,
          auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
          },
          
        }, 
        defaults: {
          from: `VIRTUOSERVICES <${process.env.MAIL_FROM}>`,
        },
        /*template: {
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },*/
      }),
    }),
  ],
})
export class EmailManagementsModule {}
