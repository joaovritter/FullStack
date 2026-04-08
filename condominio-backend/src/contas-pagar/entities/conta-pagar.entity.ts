import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Fornecedor } from '../../fornecedores/entities/fornecedor.entity';
import { Pagamento } from '../../pagamentos/entities/pagamento.entity';

@Entity('CONTAS_PAGAR')
export class ContaPagar {
  @PrimaryGeneratedColumn({ name: 'id_conta_pagar' })
  idContaPagar: number;

  @ManyToOne(() => Fornecedor, fornecedor => fornecedor.contasPagar)
  @JoinColumn({ name: 'id_fornecedor' })
  fornecedor: Fornecedor;

  @Column({ name: 'descricao', type: 'text', nullable: true })
  descricao: string;

  @Column({ name: 'valor', type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor: number;

  @Column({ name: 'data_vencimento', type: 'date', nullable: true })
  dataVencimento: Date;

  @Column({ name: 'status', type: 'varchar', length: 20, nullable: true })
  status: string;

  @OneToMany(() => Pagamento, pagamento => pagamento.contaPagar)
  pagamentos: Pagamento[];
}
