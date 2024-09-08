import { Entity, PrimaryColumn, Column} from "typeorm"

@Entity({name: "users_homes"})
export class Users_Homes {
    
    @PrimaryColumn()
    home_id: number

    @PrimaryColumn()
    user_id: number
}


