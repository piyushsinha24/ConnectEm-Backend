import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Module } from '@nestjs/common';
import { TokenModule } from '../token/token.module';
import { HarperModule } from '../harper/harper.module';
import { UserModule } from '../user/user.module';
import { EventtModule } from '../event/eventt.module';

@Module({
    imports: [
        TokenModule,
        HarperModule,
        UserModule,
        EventtModule,
    ],
    controllers: [
        BookController,
    ],
    providers: [
        BookService,
    ],
    exports: [
        BookService,
    ]
})
export class BookModule { }
