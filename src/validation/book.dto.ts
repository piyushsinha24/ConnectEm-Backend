import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class BookDTO {

    @IsString()
    @IsNotEmpty()
    eventID: string

    @IsString()
    @IsNotEmpty()
    dateID: string

    @IsString()
    @IsNotEmpty()
    slotID: string

    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    timezone: string
}