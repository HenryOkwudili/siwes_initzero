import { AccountsService } from '@app/accounts/accounts.service';

import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '@app/iam/config/jwt.config';
import { UserService } from '@app/users/users.service';
import { UserDatabaseService } from '@app/users/db/users.db.service';
import {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
} from '@app/iam/authentication/dto';
import { HashingService } from '@app/users/hashing.service';
import { validateAccountId } from '@app/core/utils/functions';
import { JwtPayload } from '@app/iam/interfaces';
import { AccountType } from '@prisma/client';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userDatabaseService: UserDatabaseService,
    private readonly hashingService: HashingService,
    private readonly userService: UserService,
    private readonly accountService: AccountsService,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async register(data: RegisterDto) {
    console.log('Data', data);
    try {
      await this.accountService.create({
        ...data,
        accountType: AccountType.BUSINESS_OWNER,
        // accountType: AccountType.ADMIN,
      }); 
    } catch (error) {
      if (error && error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('User with that email already exists');
      }
      throw error;
    }
  }

  async login(data: LoginDto) {
    const { email, password } = data;
    const user = await this.userDatabaseService.findFirst({ email });

    if (!user) {
      return ("User not found");
      // return null;
    }

    const isValidPassword = await this.hashingService.comparePasswords(
      password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid Credentials'); // Invalid password
    }

    if (!user.accounts || user.accounts.length === 0) {
      throw new UnauthorizedException('No Accounts created for user');
    }

    if (validateAccountId(user.accountId, user.accounts)) {
      throw new UnauthorizedException('Invalid Account Specified');
    }


    const accessToken = await this.signToken<JwtPayload>(
      user.id,
      this.jwtConfiguration.accessTokenTtl,
      { 
        email: user.email,
        currentAccountId: user.accounts[0].id,
        currentAccountType: user.accounts[0].type,
      },
    );

    try {
      await this.userDatabaseService.update(user.id, {
        lastLogin: new Date(),
      });
    } catch (error) {
      console.error('Error updating last login:', error);
    }

    return { accessToken: accessToken };
  }

  //
  // async updateUser(user: any, data: UpdateUserProfileDto) {
  //   await this.usersDatabaseService.update(user.id, data);
  //   const updatedFields = Object.keys(data)
  //     .filter((key) => data[key] !== undefined)
  //     .map((key) => key.charAt(0).toUpperCase() + key.slice(1))
  //     .join(', ');
  //
  //   const message = updatedFields
  //     ? `Your ${updatedFields} ${
  //         updatedFields.includes(',') ? 'have' : 'has'
  //       } been updated.`
  //     : 'No fields were updated.';
  //   return { message };
  // }
  //
  async changePassword(user: any, changePassword: ChangePasswordDto) {
    try {
      return await this.userService.changePassword(user.id, changePassword);
    } catch (error) {
      throw error;
    }
  }

  async verifyToken(data) {
    return await this.accountService.verifyCode(data.code);
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
