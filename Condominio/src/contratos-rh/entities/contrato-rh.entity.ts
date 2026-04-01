import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Funcionario } from '../../funcionarios/entities/funcionario.entity';

@Entity('CONTRATOS_RH')
export class ContratoRH {
  @PrimaryGeneratedColumn({ name: 'id_contrato_rh' })
  idContratoRh: number;

  @ManyToOne(() => Funcionario, funcionario => funcionario.contratos)
  @JoinColumn({ name: 'id_funcionario' })
  funcionario: Funcionario;

  @Column({ name: 'descricao', type: 'text', nullable: true })
  descricao: string;

  @Column({ name: 'data_inicio', type: 'date', nullable: true })
  dataInicio: Date;

  @Column({ name: 'data_fim', type: 'date', nullable: true })
  dataFim: Date;

  @Column({ name: 'salario_acordado', type: 'decimal', precision: 10, scale: 2, nullable: true })
  salarioAcordado: number;
}
