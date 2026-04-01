import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Pessoa } from '../../pessoas/entities/pessoa.entity';
import { ContratoRH } from '../../contratos-rh/entities/contrato-rh.entity';

@Entity('FUNCIONARIOS')
export class Funcionario {
  @PrimaryGeneratedColumn({ name: 'id_funcionarios' })
  idFuncionario: number;

  @ManyToOne(() => Pessoa, pessoa => pessoa.funcionarios)
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: Pessoa;

  @Column({ name: 'funcao', type: 'varchar', length: 255 })
  funcao: string;

  @Column({ name: 'data_admissao', type: 'date', nullable: true })
  dataAdmissao: Date;

  @Column({ name: 'salario', type: 'decimal', precision: 10, scale: 2, nullable: true })
  salario: number;

  @OneToMany(() => ContratoRH, contratoRh => contratoRh.funcionario)
  contratos: ContratoRH[];
}
