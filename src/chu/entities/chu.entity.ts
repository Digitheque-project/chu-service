import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('chus')
export class Chu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  responsable: string;
}
