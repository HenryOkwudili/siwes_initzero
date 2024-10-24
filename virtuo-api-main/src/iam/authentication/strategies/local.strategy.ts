import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from '@app/iam/authentication/authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthenticationService) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
    });
  }

  // async validate(request: Request): Promise<any> {
  //   const { email, password } = request.body;
  //   const user = await this.authService.login({ email, password });
  //
  //   if (!user) {
  //     throw new UnauthorizedException('Invalid Credentials');
  //   }
  //
  //   return user;
  // }
}
