import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm'
import Citizen from './Citizen'
import OccurrenceHistory from './OccurrenceHistory'
import OccurrenceInternalComment from './OccurrenceInternalComment'
import OccurrencePhoto from './OccurrencePhoto'
import OccurrenceViolator from './OccurrenceViolator'

@Entity()
export default class Occurrence {
    @PrimaryColumn()
    @Generated('uuid')
    id: string

    @Column()
    category: string

    @Column()
    status: string

    @Column()
    description: string

    @Column({ nullable: true })
    address: string

    @Column({ nullable: true })
    number: string

    @Column({ nullable: true })
    violationNumber: string

    @Column({ nullable: true })
    district: string

    @Column({ nullable: true })
    reference: string

    @Column({ nullable: true })
    latitude: string

    @Column({ nullable: true })
    longitude: string

    @Column({ default: false })
    newNotification: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => Citizen, (citizen) => citizen.occurrences)
    citizen: Citizen

    @OneToMany(() => OccurrenceHistory, (reference) => reference.occurrence)
    histories: OccurrenceHistory[]

    @OneToMany(
        () => OccurrenceInternalComment,
        (reference) => reference.occurrence
    )
    internalComments: OccurrenceInternalComment[]

    @OneToMany(() => OccurrencePhoto, (reference) => reference.occurrence)
    photos: OccurrenceHistory[]

    @OneToOne(() => OccurrenceViolator, (relation) => relation.occurrence)
    violator: OccurrenceViolator
}
