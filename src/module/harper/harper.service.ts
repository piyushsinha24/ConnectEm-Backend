import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DBConfig } from 'src/config/db.config';
const harperive = require('harperive').Client;

@Injectable()
export class HarperService {
    constructor(
        private readonly dbConfig: ConfigService<DBConfig>,
    ) { }

    getClient(): any {
        let client = new harperive({
            harperHost: this.dbConfig.get<string>('DB_HOST'),
            username: this.dbConfig.get<string>('DB_USER'),
            password: this.dbConfig.get<string>('DB_PASS'),
            schema: this.dbConfig.get<string>('DB_NAME'),
        })

        return client
    }
}
