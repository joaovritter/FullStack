import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Funcionario } from '../../funcionarios/entities/funcionario.entity';

@Entity('CONTRATOS_RH')
export class ContratoRH {
  @PrimaryGeneratedColumn({ name: 'ID_CONTRATO_RH' })
  ID_CONTRATO_RH: number;

  @ManyToOne(() => Funcionario, funcionario => funcionario.contratos)
  @JoinColumn({ name: 'ID_FUNCIONARIO' })
  funcionario: Funcionario;

  @Column({ name: 'ID_FUNCIONARIO' })
  ID_FUNCIONARIO: number;

  @Column({ name: 'DESCRICAO', type: 'varchar', length: 255, nullable: true })
  DESCRICAO: string;

  @Column({ name: 'DATA_INICIO', type: 'date', nullable: true })
  DATA_INICIO: Date;

  @Column({ name: 'DATA_FIM', type: 'date', nullable: true })
  DATA_FIM: Date;

  @Column({ name: 'SALARIO_ACORDADO', type: 'decimal', precision: 10, scale: 2, nullable: true })
  SALARIO_ACORDADO: number;
}
