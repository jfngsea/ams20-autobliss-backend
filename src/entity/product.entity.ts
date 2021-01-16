import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../interfaces/product.interface';

@Entity()
export class Part implements Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  brand: string;

  @Column('text')
  model: string;

  @Column('text')
  country: string;

  @Column('text')
  condition: string;

  @Column('numeric')
  price: number;

  @Column('numeric')
  quantity: number;

  @Column('text', { default: '' })
  imgUrl: string;

  @Column('numeric')
  makerId: number;

  @Column('numeric')
  ean: number;

  @Column('uuid')
  vendorId: string;
}
