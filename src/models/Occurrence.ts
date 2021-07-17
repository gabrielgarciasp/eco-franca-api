import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm'
import Citizen from './Citizen'
import OccurrenceHistory from './OccurrenceHistory'
import OccurrenceInternalComment from './OccurrenceInternalComment'
import OccurrencePhoto from './OccurrencePhoto'

@Entity()
export default class Occurrence {
    @PrimaryColumn()
    @Generated('uuid')
    id: string

    @Column()
    category: number

    @Column()
    status: number

    @Column()
    description: string

    @Column()
    cep: string

    @Column()
    address: string

    @Column()
    number: string

    @Column()
    district: string

    @Column()
    reference: string

    @Column()
    latitude: string

    @Column()
    longitude: string

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
}
