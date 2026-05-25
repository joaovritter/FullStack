import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Pessoa } from '../../pessoas/entities/pessoa.entity';
import { Visita } from '../../visitas/entities/visita.entity';

@Entity('VISITANTES')
export class Visitante {
  @PrimaryGeneratedColumn({ name: 'ID_VISITANTE' })
  ID_VISITANTE: number;

  @ManyToOne(() => Pessoa, pessoa => pessoa.visitantes)
  @JoinColumn({ name: 'ID_PESSOA' })
  pessoa: Pessoa;

  @Column({ name: 'ID_PESSOA' })
  ID_PESSOA: number;

  @Column({ name: 'DOCUMENTO', type: 'varchar', length: 255, nullable: true })
  DOCUMENTO: string;

  @OneToMany(() => Visita, visita => visita.visitante)
  visitas: Visita[];
}
