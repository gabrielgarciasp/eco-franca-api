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
export default class OccurrenceInternalComment {
    @PrimaryColumn()
    @Generated('uuid')
    id: string

    @Column()
    comment: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(() => Occurrence, (reference) => reference.internalComments)
    occurrence: Occurrence

    @ManyToOne(() => Employee, (reference) => reference.internalComments)
    employee: Employee
}
