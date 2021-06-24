import { Module } from '@nestjs/common';
import { HarperModule } from '../harper/harper.module';
import { TokenModule } from '../token/token.module';
import { UserService } from '../user/user.service';
import { UserController } from '../user/user.controller';

@Module({
    imports: [
        TokenModule,
        HarperModule,
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }
