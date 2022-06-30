import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly auth: AuthService) {}
  use(req: any, res: any, next: () => void) {
    const token = req.get('Authroization').substring(7);
    const tokenData = this.auth.validateToken(token);
    if (typeof tokenData === 'string')
      throw new UnauthorizedException('Session expired');
    next();
  }
}
