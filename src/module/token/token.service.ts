import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/entity/token';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
    ) { }

    createToken(id: string): string {
        let token = this.jwtService.sign({
            id
        })

        return token
    }


    verifyToken(token: string): Token {
        try {
            let obj = this.jwtService.verify<Token>(token)
            return obj
        } catch (e) {
            return null
        }
    }
}
