import { IsArray, IsNotEmpty, IsString } from "class-validator"

export class EventDateDTO {

    @IsString()
    date: string

    @IsArray()
    slotLimit: number[]

    @IsArray()
    from: string[]

    @IsArray()
    to: string[]
}

export class CreateEventDTO {

    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    eventLink: string

    @IsArray()
    tags: string[]

    @IsArray()
    timing?: EventDateDTO[]
}

