import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('numeric')
    partId: number;

    @Column('uuid')
    userId: string;

    @Column('text')
    userName: string;

    @Column('text')
    content: string;
}