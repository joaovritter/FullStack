import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Fornecedor } from '../../fornecedores/entities/fornecedor.entity';
import { Pagamento } from '../../pagamentos/entities/pagamento.entity';

@Entity('CONTAS_PAGAR')
export class ContaPagar {
  @PrimaryGeneratedColumn({ name: 'ID_CONTA_PAGAR' })
  ID_CONTA_PAGAR: number;

  @ManyToOne(() => Fornecedor, fornecedor => fornecedor.contasPagar)
  @JoinColumn({ name: 'ID_FORNECEDOR' })
  fornecedor: Fornecedor;

  @Column({ name: 'ID_FORNECEDOR' })
  ID_FORNECEDOR: number;

  @Column({ name: 'DESCRICAO', type: 'text', nullable: true })
  DESCRICAO: string;

  @Column({ name: 'VALOR', type: 'decimal', precision: 10, scale: 2, nullable: true })
  VALOR: number;

  @Column({ name: 'DATA_VENCIMENTO', type: 'date', nullable: true })
  DATA_VENCIMENTO: Date;

  @Column({ name: 'STATUS', type: 'enum', enum: ['PAGO', 'PENDENTE', 'ATRASADO', 'EXPIRADO'], nullable: true })
  STATUS: string;

  @OneToMany(() => Pagamento, pagamento => pagamento.contaPagar)
  pagamentos: Pagamento[];
}
