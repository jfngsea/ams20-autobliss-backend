import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['id'])
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('text')
    userId: string;

    @Column('text')
    name: string;

    @Column('text')
    address: string;

    @Column('text')
    zipCode: string;

    @Column('text')
    city: string;
}