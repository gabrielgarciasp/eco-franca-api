import {
    Column,
    PrimaryColumn,
    Generated,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'

export default class User {
    @PrimaryColumn()
    @Generated('uuid')
    id: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column({ nullable: true })
    hash_update_password: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
