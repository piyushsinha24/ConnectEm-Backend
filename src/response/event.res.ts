import { Event } from "src/entity/event.entity"

export class EventRes {
    success: boolean

    data: Event
}

export class EventListRes {
    success: boolean

    data: Event[]
}

export class EventCancelRes {
    success: boolean

    data: string
}