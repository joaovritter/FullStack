import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Morador } from '../../moradores/entities/morador.entity';
import { Visita } from '../../visitas/entities/visita.entity';

@Entity('UNIDADES')
export class Unidade {
  @PrimaryGeneratedColumn({ name: 'id_unidade' })
  idUnidade: number;

  @Column({ name: 'num_unidade', type: 'int' })
  numUnidade: number;

  @Column({ name: 'bloco', type: 'int' })
  bloco: number;

  @Column({ name: 'tipo', type: 'varchar', length: 255 })
  tipo: string;

  @Column({ name: 'area_total', type: 'float', nullable: true })
  areaTotal: number;

  @OneToMany(() => Morador, morador => morador.unidade)
  moradores: Morador[];

  @OneToMany(() => Visita, visita => visita.unidade)
  visitas: Visita[];
}
