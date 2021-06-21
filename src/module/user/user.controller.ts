import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { IdGuard } from 'src/guard/id.guard';
import { CommonResponse } from 'src/response/common.res';
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from 'src/validation/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Post('register')
    register(@Body() userDTO: CreateUserDTO): Promise<CommonResponse> {
        return this.userService.register(userDTO)
    }

    @Post('login')
    login(@Body() userDTO: LoginUserDTO): Promise<CommonResponse> {
        return this.userService.login(userDTO)
    }


    @Put()
    @UseGuards(IdGuard)
    update(
        @Param('id') id: string,
        @Body() userDTO: UpdateUserDTO
    ): Promise<CommonResponse> {
        return this.userService.update(id, userDTO)
    }

    @Get('me')
    @UseGuards(IdGuard)
    me(@Param('id') id: string): Promise<CommonResponse> {
        return this.userService.me(id)
    }

    @Get()
    getAll(): Promise<CommonResponse> {
        return this.userService.getAll()
    }
}
