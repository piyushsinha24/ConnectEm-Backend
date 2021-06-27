import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

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
    timings?: TimingDTO[]
}


export class TimingDTO {

    @IsString()
    @IsNotEmpty()
    date: string

    @IsArray()
    slots?: SlotDTO[]
}

export class SlotDTO {

    @IsString()
    @IsNotEmpty()
    from: string

    @IsString()
    @IsNotEmpty()
    to: string

    @IsNumber()
    available: number
}

export class UpdateEventDTO {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title?: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    eventLink?: string

    @IsArray()
    @IsOptional()
    tags?: string[]
}

export class UpdateTimingDTO {
    @IsString()
    @IsNotEmpty()
    id: string

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    date?: string

    @IsArray()
    @IsOptional()
    slots?: UpdateSlotsDTO[]
}

export class UpdateSlotsDTO {

    @IsString()
    @IsNotEmpty()
    id: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    from?: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    to?: string

    @IsNumber()
    @IsOptional()
    available?: number

    @IsArray()
    @IsOptional()
    email?: string[]

    @IsArray()
    @IsOptional()
    name?: string[]
}