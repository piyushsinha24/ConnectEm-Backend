
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { CommonConfig } from 'src/config/common.config';

@Injectable()
export class DevGuard implements CanActivate {

  constructor(
    private readonly devConfig: ConfigService<CommonConfig>,
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.devConfig.get<string>('NODE_ENV') === 'development';
  } s
}
