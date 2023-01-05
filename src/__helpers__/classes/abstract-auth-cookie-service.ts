import { NODE_ENV } from '../../__helpers__';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export abstract class AbstractAuthCookieService {
  private readonly secure: string;
  private readonly domain: string;

  protected abstract readonly jwtService: JwtService;
  protected abstract readonly configService: ConfigService;

  constructor(protected readonly nodeEnv: NODE_ENV | null) {
    this.secure =
      nodeEnv === NODE_ENV.PROD || nodeEnv === NODE_ENV.STAGE
        ? 'Secure; SameSite=None;'
        : '';

    this.domain =
      nodeEnv === NODE_ENV.PROD
        ? 'domain=.tekana.com;'
        : nodeEnv === NODE_ENV.STAGE
        ? 'domain=.rssb.onrender.com;'
        : '';
  }

  getCookie(name: string, token: string, maxAge: number) {
    return `${name}=${token}; HttpOnly; ${this.secure} Path=/; ${this.domain} Max-Age=${maxAge};`;
  }

  signJwt(payload: object, signOptions: JwtSignOptions) {
    return this.jwtService.sign(payload, signOptions);
  }
}
