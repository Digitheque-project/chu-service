import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('chus')
export class Chu {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column()
  address!: string;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @Column()
  responsable!: string;

  // Nom de fichier du logo, stocke par le service upload (ex: "<uuid>.png").
  // C'est cette valeur qui est embarquee dans le token via l'auth-service,
  // et qui permet ensuite un GET <UPLOAD_PUBLIC_URL>/files/<logo>.
  @Column({ nullable: true })
  logo?: string;
}
