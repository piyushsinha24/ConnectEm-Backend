import { Module } from '@nestjs/common';
import { HarperModule } from '../harper/harper.module';
import { MailModule } from '../mail/mail.module';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
    imports: [
        TokenModule,
        HarperModule,
        UserModule,
        MailModule,
    ],
    controllers: [EventController],
    providers: [EventService],
    exports: [EventService]
})
export class EventtModule { }
