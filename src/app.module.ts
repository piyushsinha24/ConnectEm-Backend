import { BookModule } from './module/book/book.module';
import { UserModule } from './module/user/user.module';
import { EventtModule } from './module/event/eventt.module';
import { HarperModule } from './module/harper/harper.module';
import { TokenModule } from './module/token/token.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    BookModule,
    UserModule,
    EventtModule,
    UserModule,
    HarperModule,
    TokenModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule { }
