import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { User } from '../interfaces/users.interface';

@Entity()
@Unique(['email'])
export class AuthUser implements User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  @IsNotEmpty()
  email: string;

  @Column('text')
  @IsNotEmpty()
  password: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column('text', { default: 'user' })
  role: string;

  @Column('int', { default: 0 })
  refreshTokenVersion = 0;
}
