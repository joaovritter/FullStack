import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ContaPagar } from '../../contas-pagar/entities/conta-pagar.entity';

@Entity('PAGAMENTOS')
export class Pagamento {
  @PrimaryGeneratedColumn({ name: 'ID_PAGAMENTO' })
  ID_PAGAMENTO: number;

  @ManyToOne(() => ContaPagar, contaPagar => contaPagar.pagamentos)
  @JoinColumn({ name: 'ID_CONTA_PAGAR' })
  contaPagar: ContaPagar;

  @Column({ name: 'ID_CONTA_PAGAR' })
  ID_CONTA_PAGAR: number;

  @Column({ name: 'DATA_PAGAMENTO', type: 'date', nullable: true })
  DATA_PAGAMENTO: Date;

  @Column({ name: 'VALOR_PAGO', type: 'decimal', precision: 10, scale: 2, nullable: true })
  VALOR_PAGO: number;

  @Column({ name: 'FORMA_PAGAMENTO', type: 'varchar', length: 30, nullable: true })
  FORMA_PAGAMENTO: string;
}
