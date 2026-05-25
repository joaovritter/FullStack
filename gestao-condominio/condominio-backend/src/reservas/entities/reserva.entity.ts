import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Morador } from '../../moradores/entities/morador.entity';
import { AreaComum } from '../../areas-comuns/entities/area-comum.entity';

@Entity('RESERVAS')
export class Reserva {
  @PrimaryGeneratedColumn({ name: 'ID_RESERVA' })
  ID_RESERVA: number;

  @Column({ name: 'DATA_RESERVA', type: 'date', nullable: true })
  DATA_RESERVA: Date;

  @Column({ name: 'HR_INICIO', type: 'time', nullable: true })
  HR_INICIO: string;

  @Column({ name: 'HR_FIM', type: 'time', nullable: true })
  HR_FIM: string;

  @ManyToOne(() => Morador, morador => morador.reservas)
  @JoinColumn({ name: 'ID_MORADOR' })
  morador: Morador;

  @Column({ name: 'ID_MORADOR' })
  ID_MORADOR: number;

  @ManyToOne(() => AreaComum, areaComum => areaComum.reservas)
  @JoinColumn({ name: 'ID_AREA_COMUM' })
  areaComum: AreaComum;

  @Column({ name: 'ID_AREA_COMUM' })
  ID_AREA_COMUM: number;
}
