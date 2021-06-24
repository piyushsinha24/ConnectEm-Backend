import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"

export class CreateUserDTO {

    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsString()
    @IsNotEmpty()
    lastName: string

    @IsEmail()
    email: string

    @IsString()
    @MinLength(6)
    password: string
}

export class UpdateUserDTO {

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    firstName?: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    lastName?: string

    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string

    @IsString()
    @MinLength(6)
    @IsOptional()
    token?: string
}

export class LoginUserDTO {
    @IsEmail()
    email: string

    @IsString()
    @MinLength(6)
    password: string
}