import { Entity, PrimaryColumn, Column, ManyToMany, JoinTable } from "typeorm"
import { Home } from "./Home"

@Entity({ name: "user" })
export class User {

    @PrimaryColumn()
    id: number

    @Column()
    username: string

    @Column()
    email: string

    @ManyToMany(() => Home)
    @JoinTable({
        name: 'users_homes',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'home_id', referencedColumnName: 'id' }
    })
    home: Home[]

}
