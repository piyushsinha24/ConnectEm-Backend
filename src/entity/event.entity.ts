export class Event {
    id: string

    hostID: string



    title: string

    description: string

    eventLink: string

    tags: string[]

    timing: EventDate[]

    isActive: boolean


}

export class EventDate {

    id: string

    eventID: string

    date: string

    slotLimit: number[]

    email: string[]

    name: string[]

    from: string[]

    to: string[]
}