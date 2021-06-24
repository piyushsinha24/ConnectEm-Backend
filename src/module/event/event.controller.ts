import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { IdGuard } from 'src/guard/id.guard';
import { EventCancelRes, EventListRes, EventRes } from 'src/response/event.res';
import { CreateEventDTO } from 'src/validation/event.dto';
import { EventService } from './event.service';

@Controller('event')
export class EventController {

    constructor(
        private readonly eventService: EventService,
    ) { }

    @Post()
    @UseGuards(IdGuard)
    async create(
        @Param('id') id: string,
        @Body() eventDTO: CreateEventDTO,
    ): Promise<EventRes> {

        let { timing, ...eventDTO2 } = eventDTO

        //* Create Event
        let eventID = await this.eventService.insertEvent(id, eventDTO2)

        //* Create Event dates
        await this.eventService.insertEventDates(eventID, timing)

        //* Get the event
        let event = await this.eventService.getOneByID(eventID)

        return {
            success: true,
            data: event,
        }
    }

    @Delete(':eventID')
    @UseGuards(IdGuard)
    async update(
        @Param('id') id: string,
        @Param('eventID') eventID: string
    ): Promise<EventCancelRes> {

        //* Cancel event
        await this.eventService.cancelEvent(id, eventID)

        return {
            success: true,
            data: 'Event Cancelled'
        }
    }

    @Get(':eventID')
    async getOne(
        @Param('eventID') eventID: string,
    ): Promise<EventRes> {

        let event = await this.eventService.getOneByID(eventID)

        return {
            success: true,
            data: event,
        }
    }

    @Get()
    @UseGuards(IdGuard)
    async getAll(
        @Param('id') id: string
    ): Promise<EventListRes> {

        let events = await this.eventService.getAll(id)

        return {
            success: true,
            data: events,
        }
    }
}
