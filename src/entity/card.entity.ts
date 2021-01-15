import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['cardId', 'cardNumber'])
export class Card {

    @PrimaryGeneratedColumn('uuid')
    cardId: string;

    @Column('text')
    userId: string;

    @Column('text')
    cardName: string;

    @Column('text')
    cardNumber: string;

    @Column('numeric')
    expMonth: number;

    @Column('numeric')
    expYear: number;

    @Column('numeric')
    cvv: number
}