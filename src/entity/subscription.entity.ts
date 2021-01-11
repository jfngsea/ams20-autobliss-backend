import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  subId: number;

  @Column('numeric')
  partId: number;

  @Column('text')
  userId: string;

  @Column('text')
  userEmail: string;
}
