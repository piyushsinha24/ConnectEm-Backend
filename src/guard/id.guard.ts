
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { TokenService } from 'src/module/token/token.service';

@Injectable()
export class IdGuard implements CanActivate {

  constructor(
    private readonly tokenService: TokenService,
  ) { }

  async validate(request: Request): Promise<boolean> {
    if (!request.headers.authorization)
      return false

    let tokenString = request.headers.authorization.split(' ')[1]

    let token = await this.tokenService.verifyToken(tokenString)

    if (token === null)
      return false

    request.params['id'] = token.id.toString()

    return true
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    //* Get token
    let request: Request = context.switchToHttp().getRequest()

    return this.validate(request)
  }
}
