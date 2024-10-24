import { forwardRef, Inject, mixin, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AccountType } from '@prisma/client';
import { accountTypeMapping } from '@app/accounts/account-type.mapping';
import { AccountDatabaseService } from '@app/accounts/accounts.db.service';
import { memoize } from '@nestjs/passport/dist/utils/memoize.util';
import { ValidationException } from '@app/core/utils/errors/http-error.filter';

export enum HandlerAction {
  CREATE,
  UPDATE,
}

export const AccountValidationPipe: (
  handlerAction: HandlerAction,
) => PipeTransform = memoize(createAccountValidationPipe);

function createAccountValidationPipe(handlerAction: HandlerAction) {
  handlerAction = !handlerAction ? HandlerAction.CREATE : handlerAction;
  class MixinAccountValidationPipe implements PipeTransform<any> {
    constructor(
      @Inject(forwardRef(() => AccountDatabaseService))
      private accountDbService: AccountDatabaseService,
    ) {}
    async transform(value: any) {
      let dto;
      let accountType;
      if (handlerAction === HandlerAction.CREATE) {
        accountType = value.accountType as keyof typeof AccountType;
        if (!accountType) {
          throw new ValidationException({
            accountType: 'Account type is required',
          });
        }
        if (!Object.values(AccountType).includes(accountType)) {
          throw new ValidationException({
            accountType: `Account type can only be one of ${Object.values(
              AccountType,
            ).join(', ')}`,
          });
        }
        dto = accountTypeMapping[accountType].createDto;
      } else {
        const accountId = value.id;
        if (!accountId) {
          throw new ValidationException({
            accountType: 'Account ID is required',
          });
        }
        const { type } = await this.accountDbService.findById(+accountId);
        accountType = type;
        dto = accountTypeMapping[accountType].updateDto;
      }
      const object = plainToInstance(dto, value);
      const errors = await validate(object);
      if (errors.length > 0) {
        const errMsg = {};
        errors.forEach((err) => {
          errMsg[err.property] = [...Object.values(err.constraints)];
        });
        throw new ValidationException(errMsg);
      }
      console.log('Pipe Data', value);
      return { ...value, accountType };
    }
  }
  return mixin(MixinAccountValidationPipe);
}
