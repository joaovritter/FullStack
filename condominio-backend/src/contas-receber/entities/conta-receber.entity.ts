import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Morador } from '../../moradores/entities/morador.entity';
import { Recebimento } from '../../recebimentos/entities/recebimento.entity';

@Entity('contas_receber') // Based on users casing
export class ContaReceber {
  @PrimaryGeneratedColumn({ name: 'id_conta_receber' })
  idContaReceber: number;

  @ManyToOne(() => Morador, morador => morador.contasReceber)
  @JoinColumn({ name: 'id_morador' })
  morador: Morador;

  @Column({ name: 'descricao', type: 'text', nullable: true })
  descricao: string;

  @Column({ name: 'valor', type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor: number;

  @Column({ name: 'data_vencimento', type: 'date', nullable: true })
  dataVencimento: Date;

  @Column({ name: 'status', type: 'varchar', length: 20, nullable: true })
  status: string;

  @OneToMany(() => Recebimento, recebimento => recebimento.contaReceber)
  recebimentos: Recebimento[];
}
