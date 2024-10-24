import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { CurrentUser, Public } from '../decorators';
import {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
} from '@app/iam/authentication/dto';
import { CurrentUserData } from '@app/iam/interfaces';
import { omit } from '@app/core/utils/functions';
import { VerifyCodeDto } from '@app/iam/authentication/dto/verify.code.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register Account',
  })
  @ApiResponse({
    status: 200,
    description: 'user created successfully',
  })
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    console.log('Received Register DTO:', registerDto);
    return await this.authService.register(registerDto);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Verify Token',
  })
  @ApiResponse({
    status: 200,
    description: 'Verification successfully',
  })
  @Post('/verify')
  async verifyToken(@Body() verifyCodeDto: VerifyCodeDto) {
    return await this.authService.verifyToken(verifyCodeDto);
  }

  @Public()
  /*@UseGuards(LocalAuthGuard)*/
  @ApiOperation({
    summary: 'Login as user of any Account',
  })
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Authenticated user data',
  })
  @Get('/me')
  async me(@CurrentUser() user: CurrentUserData) {
    return omit(user, ['password', 'hashedRt']);
  }
  //
  // @ApiBearerAuth()
  // @ApiOperation({
  //   summary: 'Update authenticated user data',
  // })
  // @Patch('/me')
  // async update(
  //   @CurrentUser() user: CurrentUserData,
  //   @Body() updateUserProfileDto: UpdateUserProfileDto,
  // ) {
  //   console.log(updateUserProfileDto);
  //   return await this.authService.updateUser(user, updateUserProfileDto);
  // }
  //
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Change password',
  })
  @Patch('/me/change-password')
  async changePassword(
    @CurrentUser() user: CurrentUserData,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(user, changePasswordDto);
  }
}
