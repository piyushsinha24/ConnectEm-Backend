import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { TokenModule } from '../token/token.module';
import { HarperModule } from '../harper/harper.module';

@Module({
    imports: [
        TokenModule,
        HarperModule,
    ],
    controllers: [
        UserController,
    ],
    providers: [
        UserService,
    ],
    exports: [
        UserService,
    ]
})
export class UserModule { }
