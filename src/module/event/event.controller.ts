import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { IdGuard } from 'src/guard/id.guard';
import { EventCancelRes, EventListRes, EventRes } from 'src/response/event.res';
import { CreateEventDTO, TimingDTO, UpdateEventDTO, UpdateTimingDTO } from 'src/validation/event.dto';
import { MailService } from '../mail/mail.service';
import { EventService } from './event.service';

@Controller('event')
export class EventController {

    constructor(
        private readonly eventService: EventService,
        private readonly mailService: MailService,
    ) { }


    @Post('/toggle/:eventID')
    @UseGuards(IdGuard)
    async cancel(
        @Param('eventID') eventID: string,
    ): Promise<EventRes> {
        let event = await this.eventService.toggleEvent(eventID)

        return {
            success: true,
            data: event,
        }
    }

    @Post()
    @UseGuards(IdGuard)
    async create(
        @Param('id') id: string,
        @Body() eventDTO: CreateEventDTO,
    ): Promise<EventRes> {

        let eventID = await this.eventService.insertOne(id, eventDTO)

        let event = await this.eventService.getOne(eventID, true)

        if (!event)
            throw new HttpException('Cannot create event', HttpStatus.BAD_REQUEST)

        return {
            success: true,
            data: event
        }
    }

    @Get('/mail')
    async sendMail(): Promise<boolean> {
        return true
    }

    @Get(':eventID')
    async getOne(
        @Param('eventID') eventID: string
    ): Promise<EventRes> {
        let event = await this.eventService.getOne(eventID, true)

        if (!event)
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND)

        return {
            success: true,
            data: event,
        }
    }

    @Get()
    @UseGuards(IdGuard)
    async getAll(
        @Param('id') id: string,
    ): Promise<EventListRes> {
        let events = await this.eventService.getAll(id)

        return {
            success: true,
            data: events,
        }
    }

    @Put()
    @UseGuards(IdGuard)
    async updateEvent(
        @Param('id') id: string,
        @Body() eventDTO: UpdateEventDTO,
    ): Promise<EventRes> {

        let event = await this.eventService.getOne(eventDTO.id, true)

        if (!event)
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND)

        let res = await this.eventService.updateEvent(eventDTO, id)

        if (!res)
            throw new HttpException('Cannot update event', HttpStatus.BAD_REQUEST)

        event = await this.eventService.getOne(eventDTO.id, true)

        return {
            success: true,
            data: event,
        }
    }

}
