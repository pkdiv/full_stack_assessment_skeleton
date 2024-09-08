import { Entity, PrimaryColumn, Column, ManyToMany, JoinTable } from "typeorm"
import { User } from "./User"

@Entity({name: "home"})
export class Home {

    @PrimaryColumn()
    id: number

    @Column()
    street_address: string

    @Column()
    state: string

    @Column()
    zip: string

    @Column("float")
    sqft: number

    @Column()
    beds: number

    @Column()
    baths: number

    @Column("float")
    list_price: number

    @ManyToMany(() => User)
    @JoinTable({
        name: 'users_homes',
        joinColumn: { name: 'home_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
    })
    user : User[]
}
