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

  /** Part payée par l'entreprise, en % (100 = tout est couvert). */
  @Column({ type: 'int', default: 100 })
  tauxCouverture!: number;

  /** Plafond mensuel de prise en charge par patient (Ar) ; vide = sans plafond. */
  @Column({ type: 'numeric', nullable: true, transformer: { to: (v?: number | null) => v, from: (v: string | null) => (v == null ? null : Number(v)) } })
  plafondMensuel?: number | null;

  @Column('uuid')
  chuId!: string;
}