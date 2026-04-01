import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ContaPagar } from '../../contas-pagar/entities/conta-pagar.entity';

@Entity('pagamentos')
export class Pagamento {
  @PrimaryGeneratedColumn({ name: 'id_pagamento' })
  idPagamento: number;

  @ManyToOne(() => ContaPagar, contaPagar => contaPagar.pagamentos)
  @JoinColumn({ name: 'id_conta_pagar' })
  contaPagar: ContaPagar;

  @Column({ name: 'data_pagamento', type: 'date', nullable: true })
  dataPagamento: Date;

  @Column({ name: 'valor_pago', type: 'decimal', precision: 10, scale: 2, nullable: true })
  valorPago: number;

  @Column({ name: 'forma_pagamento', type: 'varchar', length: 30, nullable: true })
  formaPagamento: string;
}
