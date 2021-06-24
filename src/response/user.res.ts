import { User } from "src/entity/user.entity"

export class UserRes {
    success: boolean
    data: User
}

export class UserListRes {
    success: boolean
    data: User[]
}