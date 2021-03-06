import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DBConfig } from 'src/config/db.config';
import { Event, Slot, Timing } from 'src/entity/event.entity';
import { genID } from 'src/util/genID.util';
import { CreateEventDTO, UpdateEventDTO } from 'src/validation/event.dto';
import { HarperService } from '../harper/harper.service';
import { UserService } from '../user/user.service';

@Injectable()
export class EventService {

    constructor(
        private readonly harperService: HarperService,
        private readonly dbConfig: ConfigService<DBConfig>,
        private readonly userService: UserService,
    ) { }


    async insertOne(id: string, eventDTO: CreateEventDTO): Promise<string> {

        let client = this.harperService.getClient()

        let timings: Timing[] = []

        //* Generate timings
        eventDTO.timings.map(t => {

            //*Generate slot
            let slots: Slot[] = []

            t.slots.map(s => {
                slots.push({
                    id: genID(),
                    email: [],
                    name: [],
                    ...s,
                })
            })

            timings.push({
                id: genID(),
                date: t.date,
                slots: slots,
            })

        })

        //* Insert event to DB
        let res = await client.insert({
            table: 'event',
            records: [
                {
                    ...eventDTO,
                    hostID: id,
                    timings: timings,
                    isActive: true,
                }
            ]
        })


        if (res.statusCode !== 200)
            throw new HttpException('Cannot create event', HttpStatus.BAD_REQUEST)

        return res.data.inserted_hashes[0]
    }

    async getOne(eventID: string, isMin: boolean): Promise<Event> {

        let event: Event

        let client = this.harperService.getClient()
        let dbName = this.dbConfig.get<string>('DB_NAME')

        let query = `SELECT * FROM ${dbName}.event WHERE id="${eventID}";`

        let res = await client.query(query)

        if (res.statusCode !== 200)
            throw new HttpException('Event query failed', HttpStatus.BAD_REQUEST)

        if (res.data.length > 0) {
            event = res.data[0]
            if (isMin) {
                let user = await this.userService.getOneByID(event.hostID, true)

                if (!user)
                    throw new HttpException('User query failed', HttpStatus.BAD_REQUEST)

                delete user.token
                delete user.id
                delete event.hostID

                event.host = user
            }

        }

        return event
    }

    async getAll(id: string): Promise<Event[]> {
        let client = this.harperService.getClient()
        let dbName = this.dbConfig.get<string>('DB_NAME')

        let query = `SELECT * FROM ${dbName}.event WHERE hostID="${id}";`

        let res = await client.query(query)

        if (res.statusCode !== 200)
            throw new HttpException('Event query failed', HttpStatus.BAD_REQUEST)

        return res.data
    }

    async toggleEvent(eventID: string): Promise<Event> {

        let client = this.harperService.getClient()

        let event = await this.getOne(eventID, false)

        if (!event)
            throw new HttpException('Event not found', HttpStatus.NOT_FOUND)

        let res = await client.update({
            table: 'event',
            records: [
                {
                    id: eventID,
                    isActive: !event.isActive,
                }
            ]
        })

        if (res.statusCode !== 200)
            throw new HttpException('Update Query failed', HttpStatus.BAD_REQUEST)

        event.isActive = !event.isActive

        return event
    }

    async updateEvent(eventDTO: UpdateEventDTO, id: string): Promise<boolean> {

        let client = this.harperService.getClient()

        let res = await client.update({
            table: 'event',
            records: [
                {
                    ...eventDTO,
                    hostID: id,
                }
            ]
        })

        if (res.statusCode !== 200)
            throw new HttpException('Update event failed', HttpStatus.BAD_REQUEST)

        if (res.data.update_hashes.length > 0)
            return true
        else
            return false
    }
}
