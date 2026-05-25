import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ContaCorrente } from '../../conta-corrente/entities/conta-corrente.entity';

@Entity('MOV_CONTA_CORRENTE')
export class MovContaCorrente {
  @PrimaryGeneratedColumn({ name: 'ID_MOVIMENTO' })
  ID_MOVIMENTO: number;

  @ManyToOne(() => ContaCorrente, contaCorrente => contaCorrente.movimentos)
  @JoinColumn({ name: 'ID_CONTA_CORRENTE' })
  contaCorrente: ContaCorrente;

  @Column({ name: 'ID_CONTA_CORRENTE' })
  ID_CONTA_CORRENTE: number;

  @Column({ name: 'ID_CONTA', type: 'int', nullable: true })
  ID_CONTA: number;

  @Column({ name: 'ORIGEM_CONTA', type: 'enum', enum: ['CONTAS_PAGAR', 'CONTAS_RECEBER', 'AVULSO'], nullable: true })
  ORIGEM_CONTA: string;

  @Column({ name: 'TIPO_MOVIMENTO', type: 'enum', enum: ['CREDITO', 'DEBITO'], nullable: true })
  TIPO_MOVIMENTO: string;

  @Column({ name: 'VALOR', type: 'decimal', precision: 10, scale: 2, nullable: true })
  VALOR: number;

  @Column({ name: 'DATA_MOVIMENTO', type: 'date', nullable: true })
  DATA_MOVIMENTO: Date;

  @Column({ name: 'HR_MOVIMENTO', type: 'time', nullable: true })
  HR_MOVIMENTO: string;

  @Column({ name: 'DESCRICAO', type: 'text', nullable: true })
  DESCRICAO: string;
}
