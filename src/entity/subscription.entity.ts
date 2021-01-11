import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  subId: number;

  @Column('int')
  userId: number;

  @Column('int')
  partId: number;
}
