import { accountTypeMapping } from '@app/accounts/account-type.mapping';

import { Injectable } from '@nestjs/common';
import { Account, AccountType, Prisma } from '@prisma/client';
import { BaseDatabaseService } from '@app/core/database/base.db.service';
import { pick } from '@app/core/utils/functions';
import {
  buildCreateOrUpdate,
  buildRelations,
  buildSearchQuery,
} from '@app/core/utils/db-query';
import { PrismaService } from '@app/core/database/prisma.service';

@Injectable()
export class AccountDatabaseService extends BaseDatabaseService {
  public searchable: string[] = ['type'];
  public relations: string[] = [];
  protected model: Prisma.AccountDelegate<any>;

  constructor(private readonly prisma: PrismaService) {
    super(prisma.account);
  }

  async findAll(filterOptions = null, paginationOptions = null) {
    const queryOptions = {};
    const { sortKey, sortDir, type, ...searchOptions } = filterOptions;
    const { skip, limit } = paginationOptions;
    const accountType = type as keyof typeof AccountType;
    const { searchable, relations } = accountTypeMapping[accountType];

    if (limit) {
      queryOptions['take'] = Number(limit);
    }

    if (skip) {
      queryOptions['skip'] = Number(skip);
    }

    if (sortKey) {
      queryOptions['orderBy'] = {
        [sortKey]: sortDir ? sortDir : 'asc',
      };
    }

    const buildWhere = {
      type,
      [type.toLowerCase()]: buildSearchQuery(searchOptions, searchable),
    };

    /* const additionalFilterOptions: any = decodeURLParams(searchOptions);

    if (additionalFilterOptions.serviceTypeId) {
      const serviceTypeIds = additionalFilterOptions.serviceTypeId
        .map(Number)
        .filter(Boolean);

      buildWhere['services'] = {
        some: {
          typeId: {
            in: serviceTypeIds,
          },
        },
      };
    }*/

    queryOptions['where'] = buildWhere;

    queryOptions['include'] = {
      users: {
        include: {},
      },
      [type.toLowerCase()]: {
        include: buildRelations(relations),
      },
    };

    return Promise.all([
      this.model.findMany(queryOptions),
      this.model.count({
        where: buildWhere,
      }),
    ]);
  }

  async create(data, tx: Prisma.TransactionClient = null): Promise<Account> {
    const accountType = data.accountType;
    // console.log('DB Data', data);
    const accountTypeRelation = AccountType[accountType].toLowerCase();

    const accountData: Prisma.AccountCreateInput = {
      type: accountType,
    };

    if (accountTypeRelation === 'student' || 'STUDENT') {
      accountData[accountTypeRelation] = {
        create: buildCreateOrUpdate(
          data,
          accountTypeMapping[accountType].fillable,
          {
            studentType: data.studentType,
            sex: data.sex,
            facultyId: data.facultyId,
            departmentId: data.departmentId,
            schoolId: data.schoolId,
            fullName: data.fullName,
          },
        ),
      };
    } else if (accountTypeRelation === 'lecturer') {
      accountData[accountTypeRelation] = {
        create: buildCreateOrUpdate(
          data,
          accountTypeMapping[accountType].fillable,
          {
            schoolId: data.schoolId,
          },
        ),
      };
    } else {
      accountData[accountTypeRelation] = {
        create: buildCreateOrUpdate(
          data,
          accountTypeMapping[accountType].fillable,
        ),
      };
    }
    accountData.users = {
      connect: {
        id: data.userId,
      },
    };

    return tx.account.create({
      data: accountData,
    });
  }

  async findById(id: number) {
    return this.model.findUniqueOrThrow({
      where: { id },
      include: {
        users: true,
      },
    });
  }

  async findAccountTypeData(
    accountId: number,
    accountType: keyof typeof AccountType,
  ) {
    const options = { where: { accountId } };

    const relations = accountTypeMapping[accountType].relations;

    if (relations.length) {
      options['include'] = buildRelations(relations);
    }

    return this.prisma[accountType.toLowerCase()].findUnique(options);
  }

  async update(id: number, data) {
    const account = await this.model.findUnique({
      where: { id },
    });

    const accountTypeRelation = AccountType[account.type].toLowerCase();

    return this.model.update({
      where: { id },
      data: {
        [accountTypeRelation]: {
          update: pick(data, accountTypeMapping[account.type].fillable),
        },
      },
    });
  }
}
