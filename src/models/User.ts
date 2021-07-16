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
    id: string | undefined

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column()
    verified_email: boolean

    @Column()
    hash_verified_email: string

    @Column({ nullable: true })
    hash_update_password: string

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}
