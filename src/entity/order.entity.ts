import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => VendorOrder, vendorOrder => vendorOrder.order)
    vendorOrder: VendorOrder[]

}

@Entity()
export class VendorOrder {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, order => order.vendorOrder)
    order: Order;

    @Column('text', {array:true})
    parts: string[];
}