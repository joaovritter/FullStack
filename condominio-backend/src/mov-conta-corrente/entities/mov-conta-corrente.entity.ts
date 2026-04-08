import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ContaCorrente } from '../../conta-corrente/entities/conta-corrente.entity';

@Entity('MOV_CONTA_CORRENTE')
export class MovContaCorrente {
  @PrimaryGeneratedColumn({ name: 'id_movimento' })
  idMovimento: number;

  @ManyToOne(() => ContaCorrente, contaCorrente => contaCorrente.movimentos)
  @JoinColumn({ name: 'id_conta_corrente' })
  contaCorrente: ContaCorrente;

  @Column({ name: 'id_conta', type: 'int', nullable: true })
  idConta: number;

  @Column({ name: 'origem_conta', type: 'varchar', length: 20, nullable: true })
  origemConta: string;

  @Column({ name: 'tipo_movimento', type: 'varchar', length: 20, nullable: true })
  tipoMovimento: string;

  @Column({ name: 'valor', type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor: number;

  @Column({ name: 'data_movimento', type: 'date', nullable: true })
  dataMovimento: Date;

  @Column({ name: 'hr_movimento', type: 'time', nullable: true })
  hrMovimento: string;

  @Column({ name: 'descricao', type: 'text', nullable: true })
  descricao: string;
}
