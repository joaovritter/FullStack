import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ContaReceber } from '../../contas-receber/entities/conta-receber.entity';

@Entity('RECEBIMENTOS')
export class Recebimento {
  @PrimaryGeneratedColumn({ name: 'ID_RECEBIMENTO' })
  ID_RECEBIMENTO: number;

  @ManyToOne(() => ContaReceber, contaReceber => contaReceber.recebimentos)
  @JoinColumn({ name: 'ID_CONTA_RECEBER' })
  contaReceber: ContaReceber;

  @Column({ name: 'ID_CONTA_RECEBER' })
  ID_CONTA_RECEBER: number;

  @Column({ name: 'DATA_RECEBIMENTO', type: 'date', nullable: true })
  DATA_RECEBIMENTO: Date;

  @Column({ name: 'VALOR_RECEBIDO', type: 'decimal', precision: 10, scale: 2, nullable: true })
  VALOR_RECEBIDO: number;

  @Column({ name: 'FORMA_RECEBIMENTO', type: 'varchar', length: 30, nullable: true })
  FORMA_RECEBIMENTO: string;
}
