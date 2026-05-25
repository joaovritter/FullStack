import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Morador } from '../../moradores/entities/morador.entity';
import { Visita } from '../../visitas/entities/visita.entity';

@Entity('UNIDADES')
export class Unidade {
  @PrimaryGeneratedColumn({ name: 'ID_UNIDADE' })
  ID_UNIDADE: number;

  @Column({ name: 'NUM_UNIDADE', type: 'int' })
  NUM_UNIDADE: number;

  @Column({ name: 'BLOCO', type: 'char', length: 3 })
  BLOCO: string;

  @Column({ name: 'TIPO', type: 'varchar', length: 50 })
  TIPO: string;

  @Column({ name: 'AREA_TOTAL', type: 'decimal', precision: 10, scale: 2, nullable: true })
  AREA_TOTAL: number;

  @OneToMany(() => Morador, morador => morador.unidade)
  moradores: Morador[];

  @OneToMany(() => Visita, visita => visita.unidade)
  visitas: Visita[];
}
