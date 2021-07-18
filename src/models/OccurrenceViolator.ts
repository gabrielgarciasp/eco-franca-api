import {
    Column,
    Entity,
    Generated,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
} from 'typeorm'
import Occurrence from './Occurrence'

@Entity()
export default class OccurrenceViolator {
    @PrimaryColumn()
    @Generated('uuid')
    id: string

    @Column({ nullable: true })
    name: string

    @Column({ nullable: true })
    vehicle: string

    @Column({ nullable: true })
    address: string

    @Column({ nullable: true })
    otherInformation: string

    @OneToOne(() => Occurrence)
    @JoinColumn()
    occurrence: Occurrence
}
