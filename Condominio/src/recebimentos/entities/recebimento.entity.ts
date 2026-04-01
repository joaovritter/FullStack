import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ContaReceber } from '../../contas-receber/entities/conta-receber.entity';

@Entity('RECEBIMENTOS')
export class Recebimento {
  @PrimaryGeneratedColumn({ name: 'id_recebimento' })
  idRecebimento: number;

  @ManyToOne(() => ContaReceber, contaReceber => contaReceber.recebimentos)
  @JoinColumn({ name: 'id_conta_receber' })
  contaReceber: ContaReceber;

  @Column({ name: 'data_recebimento', type: 'date', nullable: true })
  dataRecebimento: Date;

  @Column({ name: 'valor_recebido', type: 'decimal', precision: 10, scale: 2, nullable: true })
  valorRecebido: number;

  @Column({ name: 'forma_recebimento', type: 'varchar', length: 30, nullable: true })
  formaRecebimento: string;
}
