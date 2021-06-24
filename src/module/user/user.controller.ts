import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { DevGuard } from 'src/guard/dev.guard';
import { IdGuard } from 'src/guard/id.guard';
import { UserListRes, UserRes } from 'src/response/user.res';
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from 'src/validation/user.dto';
import { TokenService } from '../token/token.service';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
    ) { }

    @Post('register')
    async register(
        @Body() userDTO: CreateUserDTO,
    ): Promise<UserRes> {

        //* Check email if exists
        let user = await this.userService.getOneByEmail(userDTO.email, true)
        if (user)
            throw new HttpException('Email already exists.', HttpStatus.BAD_REQUEST)

        //* Hash password
        let hashedPass = await hash(userDTO.password)
        userDTO.password = hashedPass

        //* Create user
        let id = await this.userService.insert(userDTO)

        //* Create and update Token
        let token = this.tokenService.createToken(id)
        await this.userService.update(
            id,
            {
                token,
            }
        )

        //* Get User
        user = await this.userService.getOneByID(id, true)

        return {
            success: true,
            data: user,
        }

    }

    @Post('login')
    async login(
        @Body() loginDTO: LoginUserDTO,
    ): Promise<UserRes> {

        //* Get user by email
        let user = await this.userService.getOneByEmail(loginDTO.email, false)

        if (!user)
            throw new HttpException('Incorrect email or password', HttpStatus.BAD_REQUEST)

        //* Check password
        let check = await verify(user.password, loginDTO.password)
        if (!check)
            throw new HttpException('Incorrect email or password', HttpStatus.BAD_REQUEST)

        //* Get user
        user = await this.userService.getOneByID(user.id, true)

        return {
            success: true,
            data: user,
        }
    }

    @Put()
    @UseGuards(IdGuard)
    async update(
        @Param('id') id: string,
        @Body() userDTO: UpdateUserDTO,
    ): Promise<UserRes> {

        //* Delete token from dto
        if (userDTO.token)
            delete userDTO.token

        //* Get the user
        let user = await this.userService.getOneByID(id, true)
        if (!user)
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)

        //* Update the user
        await this.userService.update(id, userDTO)

        //* Get updated user
        user = await this.userService.getOneByID(id, true)

        return {
            success: true,
            data: user,
        }
    }

    @Get('me')
    @UseGuards(IdGuard)
    async me(
        @Param('id') id: string
    ): Promise<UserRes> {

        //* Get user
        let user = await this.userService.getOneByID(id, true)
        if (!user)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)

        return {
            success: true,
            data: user
        }
    }

    @Get()
    @UseGuards(DevGuard)
    async getAll(): Promise<UserListRes> {
        let users = await this.userService.getAll(true)

        return {
            success: true,
            data: users,
        }
    }
}
