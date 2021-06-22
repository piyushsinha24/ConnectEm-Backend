import { classToPlain, Exclude } from "class-transformer"

export class User {
    id: string

    firstName: string

    lastName: string

    email: string

    @Exclude()
    password: string

    token?: string

    toJSON() {
        return classToPlain(this)
    }
}