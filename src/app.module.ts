import { UserModule } from './module/user/user.module';
import { HarperModule } from './module/harper/harper.module';
import { TokenModule } from './module/token/token.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    HarperModule,
    TokenModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule { }
