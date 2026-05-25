import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Pessoa } from '../../pessoas/entities/pessoa.entity';
import { Contrato } from '../../contratos/entities/contrato.entity';
import { ContaPagar } from '../../contas-pagar/entities/conta-pagar.entity';

@Entity('FORNECEDORES')
export class Fornecedor {
  @PrimaryGeneratedColumn({ name: 'ID_FORNECEDOR' })
  ID_FORNECEDOR: number;

  @ManyToOne(() => Pessoa, pessoa => pessoa.fornecedores)
  @JoinColumn({ name: 'ID_PESSOA' })
  pessoa: Pessoa;

  @Column({ name: 'ID_PESSOA' })
  ID_PESSOA: number;

  @Column({ name: 'AREA_ATUACAO', type: 'varchar', length: 255, nullable: true })
  AREA_ATUACAO: string;

  @OneToMany(() => Contrato, contrato => contrato.fornecedor)
  contratos: Contrato[];

  @OneToMany(() => ContaPagar, contaPagar => contaPagar.fornecedor)
  contasPagar: ContaPagar[];
}
