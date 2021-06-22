import { HarperService } from './harper.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [],
    providers: [
        HarperService,
    ],
    exports: [
        HarperService,
    ]
})
export class HarperModule { }
