import { Column, Entity, Generated, ManyToOne, PrimaryColumn } from 'typeorm'
import Occurrence from './Occurrence'

@Entity()
export default class OccurrencePhoto {
    @PrimaryColumn()
    @Generated('uuid')
    id: string

    @Column()
    filaname: string

    @ManyToOne(() => Occurrence, (reference) => reference.histories)
    occurrence: Occurrence
}
