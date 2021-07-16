import { Column, Entity } from 'typeorm'
import User from './User'

@Entity()
export default class Employee extends User {
    @Column()
    ra: string

    @Column()
    admin: boolean

    @Column()
    active: boolean
}
