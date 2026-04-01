import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Pessoa } from '../../pessoas/entities/pessoa.entity';
import { Visita } from '../../visitas/entities/visita.entity';

@Entity('VISITANTES')
export class Visitante {
  @PrimaryGeneratedColumn({ name: 'id_visitantes' })
  idVisitante: number;

  @ManyToOne(() => Pessoa, pessoa => pessoa.visitantes)
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: Pessoa;

  @Column({ name: 'documento', type: 'varchar', length: 255, nullable: true })
  documento: string;

  @OneToMany(() => Visita, visita => visita.visitante)
  visitas: Visita[];
}
