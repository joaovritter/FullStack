import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  ID_PESSOA: number;

  @Column()
  NOME: string;

  @Column({ unique: true })
  CPF_CNPJ: string;

  @Column()
  password: string; // Onde ficará o hash do bcrypt
}