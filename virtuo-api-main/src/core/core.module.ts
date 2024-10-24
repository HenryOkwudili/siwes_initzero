import { Global, Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Global()
@Module({ exports: [PrismaService], providers: [PrismaService] })
export class CoreModule {}
