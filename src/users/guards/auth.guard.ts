import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY } from '../../__helpers__/enums';

@Injectable()
export class LocalAuthGuard extends AuthGuard(STRATEGY.LOCAL) {}

@Injectable()
export class JwtATGuard extends AuthGuard(STRATEGY.JWT_AT) {}

@Injectable()
export class JwtRTGuard extends AuthGuard(STRATEGY.JWT_RT) {}
