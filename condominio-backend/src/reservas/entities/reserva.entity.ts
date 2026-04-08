import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Morador } from '../../moradores/entities/morador.entity';
import { AreaComum } from '../../areas-comuns/entities/area-comum.entity';

@Entity('RESERVAS')
export class Reserva {
  @PrimaryGeneratedColumn({ name: 'id_reserva' })
  idReserva: number;

  @Column({ name: 'data_reserva', type: 'date', nullable: true })
  dataReserva: Date;

  @Column({ name: 'hr_inicio', type: 'date', nullable: true })
  hrInicio: Date;

  @Column({ name: 'hr_fim', type: 'date', nullable: true })
  hrFim: Date;

  @ManyToOne(() => Morador, morador => morador.reservas)
  @JoinColumn({ name: 'id_morador' })
  morador: Morador;

  @ManyToOne(() => AreaComum, areaComum => areaComum.reservas)
  @JoinColumn({ name: 'id_areas_comum' })
  areaComum: AreaComum;
}
