import { User } from "./user.entity"

export class Event {
    id?: string

    hostID: string

    host?: User

    title: string

    description: string

    eventLink: string

    tags: string[]

    timings: Timing[]

    isActive: boolean

}

export class Timing {

    id: string

    date: string

    slots: Slot[]
}

export class Slot {
    id: string

    from: string

    to: string

    available: number

    email: string[]

    name: string[]
}