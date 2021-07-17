import { Column, Entity, OneToMany } from 'typeorm'
import OccurrenceHistory from './OccurrenceHistory'
import OccurrenceInternalComment from './OccurrenceInternalComment'
import User from './User'

@Entity()
export default class Employee extends User {
    @Column()
    ra: string

    @Column({ default: true })
    active: boolean

    @OneToMany(() => OccurrenceHistory, (reference) => reference.occurrence)
    histories: OccurrenceHistory[]

    @OneToMany(
        () => OccurrenceInternalComment,
        (reference) => reference.occurrence
    )
    internalComments: OccurrenceInternalComment[]
}
