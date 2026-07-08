import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('prise_en_charge')
export class PriseEnCharge {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  companyName!: string;

  @Column({ nullable: true })
  nif?: string;

  @Column({ nullable: true })
  contactEmail?: string;

  @Column({ nullable: true })
  contactPhone?: string;

  @Column({ nullable: true, type: 'text' })
  address?: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column('uuid')
  chuId!: string;
}