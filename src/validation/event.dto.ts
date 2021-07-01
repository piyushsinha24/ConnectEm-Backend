import { Type } from "class-transformer"
import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"

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

    @IsString()
    @IsNotEmpty()
    timezone: string

    @IsArray()
    tags: string[]

    @ValidateNested({ each: true })
    @Type(() => TimingDTO)
    timings: TimingDTO[]
}

export class TimingDTO {

    @IsString()
    @IsNotEmpty()
    date: string

    @ValidateNested({ each: true })
    @Type(() => SlotDTO)
    slots: SlotDTO[]
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

    @ValidateNested({ each: true })
    @Type(() => UpdateTimingDTO)
    timings: UpdateTimingDTO[]

    @IsBoolean()
    isActive: boolean
}

export class UpdateTimingDTO {
    @IsString()
    @IsNotEmpty()
    id: string

    @IsString()
    @IsNotEmpty()
    date: string

    @ValidateNested({ each: true })
    @Type(() => UpdateSlotsDTO)
    slots: UpdateSlotsDTO[]
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