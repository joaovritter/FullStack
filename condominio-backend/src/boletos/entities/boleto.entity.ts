import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Morador } from '../../moradores/entities/morador.entity';

@Entity('BOLETOS')
export class Boleto {
  @PrimaryGeneratedColumn({ name: 'id_boleto' })
  idBoleto: number;

  @ManyToOne(() => Morador, morador => morador.boletos)
  @JoinColumn({ name: 'id_morador' })
  morador: Morador;

  @Column({ name: 'vl_boleto', type: 'decimal', precision: 10, scale: 2 })
  vlBoleto: number;

  @Column({ name: 'dt_vencimento', type: 'date' })
  dtVencimento: Date;

  @Column({ name: 'status', type: 'enum', enum: ['Pago', 'Atrasado', 'Pendente'], nullable: true })
  status: string;
}
