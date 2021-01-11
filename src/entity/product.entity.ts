import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../interfaces/product.interface';

@Entity()
export class Part implements Product {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  carBrand: string;

  @Column('text')
  carModel: string;

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
  vendorId: number;
}
