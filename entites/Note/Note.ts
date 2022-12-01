import { Entity,Column,PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Note{
    @PrimaryGeneratedColumn()
   "id":String;

    @Column()
    "title":string;
    
    @Column()
    "content":string;
}