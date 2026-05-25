import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Pessoa } from '../../pessoas/entities/pessoa.entity';
import { ContratoRH } from '../../contratos-rh/entities/contrato-rh.entity';

@Entity('FUNCIONARIOS')
export class Funcionario {
  @PrimaryGeneratedColumn({ name: 'ID_FUNCIONARIO' })
  ID_FUNCIONARIO: number;

  @ManyToOne(() => Pessoa, pessoa => pessoa.funcionarios)
  @JoinColumn({ name: 'ID_PESSOA' })
  pessoa: Pessoa;

  @Column({ name: 'ID_PESSOA' })
  ID_PESSOA: number;

  @Column({ name: 'FUNCAO', type: 'varchar', length: 255 })
  FUNCAO: string;

  @Column({ name: 'DATA_ADMISSAO', type: 'date', nullable: true })
  DATA_ADMISSAO: Date;

  @Column({ name: 'SALARIO', type: 'decimal', precision: 10, scale: 2, nullable: true })
  SALARIO: number;

  @OneToMany(() => ContratoRH, contratoRh => contratoRh.funcionario)
  contratos: ContratoRH[];
}
