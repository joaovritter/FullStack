import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Reserva } from '../../reservas/entities/reserva.entity';

@Entity('AREA_COMUM')
export class AreaComum {
  @PrimaryGeneratedColumn({ name: 'ID_AREA_COMUM' })
  ID_AREA_COMUM: number;

  @Column({ name: 'NOME', type: 'varchar', length: 55, nullable: true })
  NOME: string;

  @Column({ name: 'DESCRICAO_AREA', type: 'varchar', length: 200, nullable: true })
  DESCRICAO_AREA: string;

  @Column({ name: 'CAPACIDADE', type: 'int', nullable: true })
  CAPACIDADE: number;

  @OneToMany(() => Reserva, reserva => reserva.areaComum)
  reservas: Reserva[];
}
