import { Column, Entity, OneToMany } from 'typeorm'
import Occurrence from './Occurrence'
import User from './User'

@Entity()
export default class Citizen extends User {
    @Column({ unique: true })
    cpf: string

    @Column()
    phone_number: string

    @Column()
    verified_email: boolean

    @Column({ nullable: true })
    hash_verified_email: string

    @OneToMany(() => Occurrence, (occurrence) => occurrence.citizen)
    occurrences: Occurrence[]
}
