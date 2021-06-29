import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BookRes } from 'src/response/book.res';
import { BookDTO } from 'src/validation/book.dto';
import { EventService } from '../event/event.service';
import { HarperService } from '../harper/harper.service';
import { UserService } from '../user/user.service';

@Injectable()
export class BookService {

    constructor(
        private readonly eventService: EventService,
    ) { }

    async bookEvent(bookDTO: BookDTO): Promise<boolean> {

        let event = await this.eventService.getOne(bookDTO.eventID, false)

        let timingIndex = event.timings.findIndex(t => t.id === bookDTO.dateID)

        if (timingIndex === -1)
            throw new HttpException('Invalid date', HttpStatus.BAD_REQUEST)

        let timing = event.timings[timingIndex]

        let slotIndex = timing.slots.findIndex(s => s.id === bookDTO.slotID)

        if (slotIndex === -1)
            throw new HttpException('Invalid slot', HttpStatus.BAD_REQUEST)

        let slot = timing.slots[slotIndex]

        if (slot.available === 0)
            throw new HttpException('Slot not available', HttpStatus.BAD_REQUEST)

        slot.available = slot.available - 1

        slot.email.push(bookDTO.email)
        slot.name.push(bookDTO.name)

        timing.slots[slotIndex] = slot
        event.timings[timingIndex] = timing

        let res = await this.eventService.updateEvent({
            ...event,
            id: event.id,
        }, event.hostID)

        if (!res)
            throw new HttpException('Cannot book slot.', HttpStatus.BAD_REQUEST)

        return res
    }
}
