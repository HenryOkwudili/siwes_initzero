import { Test, TestingModule } from '@nestjs/testing';
import { EmailManagementsService } from './email-managements.service';

describe('EmailManagementsService', () => {
  let service: EmailManagementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailManagementsService],
    }).compile();

    service = module.get<EmailManagementsService>(EmailManagementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
