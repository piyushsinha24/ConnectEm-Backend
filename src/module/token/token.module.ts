import { TokenService } from './token.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonConfig } from 'src/config/common.config';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (commonConfig: ConfigService<CommonConfig>) => ({
                secret: commonConfig.get<string>('JWT_SECRET')
            })
        }),
    ],
    providers: [
        TokenService,
    ],
    exports: [
        TokenService,
    ]
})
export class TokenModule { }
