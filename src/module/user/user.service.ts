import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { User } from 'src/entity/user.entity';
import { CommonResponse } from 'src/response/common.res';
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from 'src/validation/user.dto';
import { HarperService } from '../harper/harper.service';
import { TokenService } from '../token/token.service';

@Injectable()
export class UserService {
    constructor(
        private readonly harperService: HarperService,
        private readonly tokenService: TokenService,
    ) { }

    async register(userDTO: CreateUserDTO): Promise<CommonResponse> {

        //* Check if user exists
        let res = await this.harperService.getOneByProperty(
            'user',
            'email',
            userDTO.email,
            true
        )
        if (res.success) {
            throw new HttpException(`Email already exists`, HttpStatus.BAD_REQUEST)
        }

        //* Hash the password
        let password = await hash(userDTO.password)
        userDTO.password = password

        //* Insert the user
        let id = await this.harperService.insertOne('user', { ...userDTO })

        //* Create Token
        let token = this.tokenService.createToken(id)

        //* Update user
        await this.harperService.update(
            'user',
            id,
            {
                token
            }
        ).catch((e) => {
            console.log(e)
            throw new HttpException('Cannot create user', HttpStatus.BAD_REQUEST)
        })

        res = await this.harperService.getOneByID(
            'user',
            id,
            false,
            'id,email,firstName,lastName,token'
        )

        return res
    }

    async login(loginDTO: LoginUserDTO): Promise<CommonResponse> {

        //* Check if email exists
        let res = await this.harperService.getOneByProperty(
            'user',
            'email',
            loginDTO.email,
            true,
        )

        if (!res.success)
            throw new HttpException('Incorrect email or password', HttpStatus.BAD_REQUEST)

        //* Check user password
        let user = res.data as User

        let res2 = await verify(user.password, loginDTO.password)

        if (!res2)
            throw new HttpException('Incorrect email or password', HttpStatus.BAD_REQUEST)

        //*Get user
        let res3 = await this.harperService.getOneByProperty(
            'user',
            'email',
            loginDTO.email,
            false,
            'id,email,firstName,lastName'
        )

        return res3
    }

    async update(id: string, userDTO: UpdateUserDTO): Promise<CommonResponse> {

        //* Check if user exists
        let res = await this.harperService.getOneByID(
            'user',
            id,
            true
        )
        if (!res.success)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)

        //* Hash password if available
        if (userDTO.password) {
            let hashedPass = await hash(userDTO.password)
            userDTO.password = hashedPass
        }

        //* Update user
        await this.harperService.update(
            'user',
            id,
            {
                ...userDTO,
            }
        ).catch((_) => {
            throw new HttpException('Cannot update user', HttpStatus.BAD_REQUEST)
        })

        //* Get user
        let res1 = await this.harperService.getOneByID(
            'user',
            id,
            false,
            'id,email,firstName,lastName,token'
        )

        if (res1.success)
            return res1
        else
            throw new HttpException('Cannot update user', HttpStatus.BAD_REQUEST)

    }

    async me(id: string): Promise<CommonResponse> {
        let res = await this.harperService.getOneByID(
            'user',
            id,
            false,
            'id,email,firstName,lastName,token',
        )

        if (res.success)
            return res
        else
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    async getAll(): Promise<CommonResponse> {
        return this.harperService.getAll(
            'user',
            false,
            'id,email,firstName,lastName'
        )
    }
}
