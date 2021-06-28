import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

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
    id: string

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
    timings: UpdateTimingDTO[]

    @IsBoolean()
    isActive: boolean
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
    from: string

    @IsString()
    @IsNotEmpty()
    to: string

    @IsNumber()
    available: number

    @IsArray()
    email: string[]

    @IsArray()
    name: string[]
}