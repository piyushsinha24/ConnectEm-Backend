import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DBConfig } from 'src/config/db.config';
import { Event } from 'src/entity/event.entity';
import { CreateEventDTO, EventDateDTO } from 'src/validation/event.dto';
import { HarperService } from '../harper/harper.service';
import { UserService } from '../user/user.service';

@Injectable()
export class EventService {

    constructor(
        private readonly harperService: HarperService,
        private readonly dbConfig: ConfigService<DBConfig>,
        private readonly userService: UserService,
    ) { }

    async getOneByID(eventID: string): Promise<Event> {

        let event: Event

        let client = this.harperService.getClient()
        let dbName = this.dbConfig.get<string>('DB_NAME')

        let eventQuery = `SELECT * FROM ${dbName}.event WHERE id="${eventID}";`
        let eventDateQuery = `SELECT * FROM ${dbName}.eventDate WHERE eventID="${eventID}";`

        let res1 = await client.query(eventQuery)
        let res2 = await client.query(eventDateQuery)

        if (res1.statusCode !== 200 || res2.statusCode !== 200)
            throw new HttpException('Event query failed', HttpStatus.BAD_REQUEST)

        if (res1.data.length > 0) {
            event = res1.data[0]
            event.timing = res2.data

            //* get the user details
            let user = await this.userService.getOneByID(event.hostID, true)
            delete user.token
            event['host'] = user
        }

        return event
    }

    async insertEvent(id: string, eventDTO: CreateEventDTO): Promise<string> {

        let client = this.harperService.getClient()

        let res = await client.insert({
            table: 'event',
            records: [
                {
                    hostID: id,
                    isActive: true,
                    ...eventDTO,
                }
            ]
        })

        if (res.statusCode !== 200)
            throw new HttpException('Cannot create event', HttpStatus.BAD_REQUEST)

        return res.data.inserted_hashes[0]
    }

    async insertEventDates(eventID: string, eventDates: EventDateDTO[]): Promise<void> {

        let data = []

        eventDates.map((ed: EventDateDTO) => {

            data.push({
                eventID: eventID,
                date: ed.date,
                slotLimit: ed.slotLimit,
                email: [],
                name: [],
                from: ed.from,
                to: ed.to,
            })
        })

        let client = this.harperService.getClient()

        let res = await client.insert({
            table: 'eventDate',
            records: data
        })

        if (res.statusCode !== 200)
            throw new HttpException('Cannot insert event dates', HttpStatus.BAD_REQUEST)
    }

    async cancelEvent(id: string, eventID: string): Promise<void> {
        let client = this.harperService.getClient()

        await client.update({
            table: 'event',
            records: [
                {
                    hostID: id,
                    id: eventID,
                    isActive: false,
                }
            ]
        }).catch(({ message }) => {
            console.log(message)
            throw new HttpException('Cannnot cancel event', HttpStatus.BAD_REQUEST)
        })
    }

    async getAll(id: string): Promise<Event[]> {
        let client = this.harperService.getClient()
        let dbName = this.dbConfig.get<string>('DB_NAME')

        let eventQuery = `SELECT * FROM ${dbName}.event WHERE hostID="${id}";`

        let res = await client.query(eventQuery)

        if (res.statusCode !== 200)
            throw new HttpException('Event query failed', HttpStatus.BAD_REQUEST)

        return res.data
    }
}
