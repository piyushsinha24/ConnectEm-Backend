import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DBConfig } from 'src/config/db.config';
import { User } from 'src/entity/user.entity';
import { CreateUserDTO, UpdateUserDTO } from 'src/validation/user.dto';
import { HarperService } from '../harper/harper.service';

@Injectable()
export class UserService {

    constructor(
        private readonly harperService: HarperService,
        private readonly dbConfig: ConfigService<DBConfig>,
    ) { }


    async insert(userDTO: CreateUserDTO): Promise<string> {
        let client = this.harperService.getClient()

        let res = await client.insert({
            table: 'user',
            records: [
                {
                    ...userDTO,
                }
            ]
        })

        if (res.statusCode !== 200)
            throw new HttpException('Cannot insert user', HttpStatus.BAD_REQUEST)

        let id = res.data.inserted_hashes[0]

        return id
    }

    async update(id: string, userDTO: UpdateUserDTO): Promise<string> {
        let client = this.harperService.getClient()

        let res = await client.update({
            table: 'user',
            records: [
                {
                    id: id,
                    ...userDTO,
                }
            ]
        })

        if (res.statusCode !== 200)
            throw new HttpException('Cannot insert user', HttpStatus.BAD_REQUEST)

        return id
    }

    async getOneByID(id: string, isMin: boolean): Promise<User> {

        let user: User

        let client = this.harperService.getClient()
        let dbName = this.dbConfig.get<string>('DB_NAME')

        let query = `SELECT ${isMin ? 'id,email,firstName,lastName,token' : '*'} FROM ${dbName}.user WHERE id= "${id}"`

        let res = await client.query(query)

        if (res.statusCode !== 200)
            throw new HttpException('User query failed', HttpStatus.BAD_REQUEST)

        if (res.data.length > 0)
            user = res.data[0]

        return user

    }

    async getOneByEmail(email: string, isMin: boolean): Promise<User> {
        let user: User

        let client = this.harperService.getClient()
        let dbName = this.dbConfig.get<string>('DB_NAME')

        let query = `SELECT ${isMin ? 'id,email,firstName,lastName,token' : '*'} FROM ${dbName}.user WHERE email="${email}";`

        let res = await client.query(query)

        if (res.statusCode !== 200)
            throw new HttpException('Check email query failed', HttpStatus.BAD_REQUEST)

        if (res.data.length > 0)
            user = res.data[0]

        return user

    }

    async getAll(isMin: boolean): Promise<User[]> {
        let client = this.harperService.getClient()
        let dbName = this.dbConfig.get<string>('DB_NAME')

        let query = `SELECT ${isMin ? 'id,email,firstName,lastName,token' : '*'} FROM ${dbName}.user;`

        let res = await client.query(query)

        if (res.statusCode !== 200)
            throw new HttpException('Check email query failed', HttpStatus.BAD_REQUEST)

        let users: User[] = []

        res.data.map(d => {
            users.push(d as User)
        })

        return users
    }
}
