import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Reserva } from '../../reservas/entities/reserva.entity';

@Entity('AREAS_COMUNS')
export class AreaComum {
  @PrimaryGeneratedColumn({ name: 'id_areas_comum' })
  idAreaComum: number;

  @Column({ name: 'nome_area', type: 'varchar', length: 255, nullable: true })
  nomeArea: string;

  @Column({ name: 'descr_area', type: 'varchar', length: 255, nullable: true })
  descrArea: string;

  @Column({ name: 'capacidade', type: 'int', nullable: true })
  capacidade: number;

  @OneToMany(() => Reserva, reserva => reserva.areaComum)
  reservas: Reserva[];
}
