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
    address?: string

    @Column({ nullable: true })
    number?: string

    @Column({ nullable: true })
    district?: string

    @Column({ nullable: true })
    reference?: string

    @Column({ nullable: true })
    latitude?: string

    @Column({ nullable: true })
    longitude?: string

    @Column()
    occurrenceDate: Date

    @Column({ default: false })
    newNotification: boolean

    @Column({ nullable: true })
    occurrenceNumber?: string

    @Column({ nullable: true })
    violationNumber?: string

    @Column({ default: false })
    deleteImages: boolean

    @Column({ default: false })
    viewed: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => Citizen, (citizen) => citizen.occurrences)
    citizen: Citizen

    @OneToMany(() => OccurrenceHistory, (reference) => reference.occurrence, {
        cascade: ['insert'],
    })
    histories: OccurrenceHistory[]

    @OneToMany(
        () => OccurrenceInternalComment,
        (reference) => reference.occurrence
    )
    internalComments: OccurrenceInternalComment[]

    @OneToMany(() => OccurrencePhoto, (reference) => reference.occurrence, {
        cascade: ['insert'],
    })
    photos: OccurrencePhoto[]

    @OneToOne(() => OccurrenceViolator, (relation) => relation.occurrence)
    violator?: OccurrenceViolator
}
