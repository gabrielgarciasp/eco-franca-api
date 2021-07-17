import {
    Column,
    CreateDateColumn,
    Entity,
    Generated,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm'
import Employee from './Employee'
import Occurrence from './Occurrence'

@Entity()
export default class OccurrenceHistory {
    @PrimaryColumn()
    @Generated('uuid')
    id: string

    @Column()
    previousStatus: string

    @Column()
    newStatus: string

    @Column()
    comment: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => Occurrence, (reference) => reference.histories)
    occurrence: Occurrence

    @ManyToOne(() => Employee, (reference) => reference.histories)
    employee: Employee
}
