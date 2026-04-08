import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Fornecedor } from '../../fornecedores/entities/fornecedor.entity';

@Entity('CONTRATOS')
export class Contrato {
  @PrimaryGeneratedColumn({ name: 'id_contrato' })
  idContrato: number;

  @ManyToOne(() => Fornecedor, fornecedor => fornecedor.contratos)
  @JoinColumn({ name: 'id_fornecedor' })
  fornecedor: Fornecedor;

  @Column({ name: 'descricao', type: 'text', nullable: true })
  descricao: string;

  @Column({ name: 'data_inicio', type: 'date', nullable: true })
  dataInicio: Date;

  @Column({ name: 'data_fim', type: 'date', nullable: true })
  dataFim: Date;

  @Column({ name: 'valor', type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor: number;
}
