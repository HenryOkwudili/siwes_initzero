import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import path from 'path';
import { MailJobInterface } from './interface/mail-job.interface';
import { EmailManagementDbService } from '@app/email-managements/email-management.db.service';
import { slugify } from '@app/core/utils/functions';

@Injectable()
export class EmailManagementsService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly mailDbService: EmailManagementDbService,
  ) {}

  async findAll(filterOptions, paginationOptions) {
    const [data, totalCount] = await this.mailDbService.findAll(
      filterOptions,
      paginationOptions,
    );
    return { data, totalCount };
  }

  async sendMail(payload: MailJobInterface, mailType: string) {
    const templatePath = path.join(
      __dirname,
      '../../..',
      'views',
      'layout.hbs',
    );

    try {
      const emailTemplate = await this.findOne(slugify(mailType));
      const bodyContent = emailTemplate.body;
      const htmlLayout = await this.readHTMLFile(templatePath);
      const mailBody = handlebars.compile(bodyContent);
      const newBody = mailBody({ ...payload.context });
      handlebars.registerHelper('bodyContent', function () {
        return new handlebars.SafeString(newBody);
      });

      const compiledTemplate = handlebars.compile(htmlLayout);
      const imageData = fs.readFileSync(
        path.join(__dirname, '../../..', 'public', '/header.jpg'),
        'binary',
      );
      const htmlBody = compiledTemplate({
        bodyContent,
        logo: `data:image/jpg;base64,${Buffer.from(
          imageData,
          'binary',
        ).toString('base64')}`, //`${process.env.IMAGE_DOMAIN}header.jpg`,
        subject: emailTemplate.subject,
      });

      const options: Record<string, any> = {
        to: payload.to,
        from: process.env.MAIL_FROM,
        subject: emailTemplate.subject,
        html: htmlBody,
        attachments: payload.attachments,
      };

      await this.mailerService.sendMail({ ...options });
      console.log(`Email sent successfully to ${payload.to}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendMailOnSandBox(payload: MailJobInterface, code: string) {
    try {
      const options = {
        to: payload.to,
        // from: '"Support Team" <support@virtuo.com>', // override default from
        subject: payload.subject,
        text: code,
      };
      await this.mailerService.sendMail({ ...options });
      console.log(`Email sent successfully to ${payload.to}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
  async create(data) {
    const createData: Prisma.EmailTemplateCreateInput = {
      ...data,
      slug: slugify(data?.title),
    };

    return await this.mailDbService.create(createData);
  }

  async findOne(slug: string) {
    return await this.mailDbService.findFirst({ slug });
  }

  async update(id, data) {
    const createData: Prisma.EmailTemplateUpdateInput = {
      ...data,
      slug: slugify(data?.title),
    };
    return await this.mailDbService.update(id, createData);
  }

  async delete(id) {
    return await this.mailDbService.delete(id);
  }

  private async readHTMLFile(path: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      fs.readFile(path, 'utf8', (err, html) => {
        if (err) {
          reject(err);
        } else {
          resolve(html);
        }
      });
    });
  }
}
