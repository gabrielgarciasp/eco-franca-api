import { Column, Entity } from 'typeorm'
import User from './User'

@Entity()
export default class Citizen extends User {
    @Column({ unique: true })
    cpf: string

    @Column()
    phone_number: string
}
