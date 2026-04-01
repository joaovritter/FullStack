import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Pessoa } from '../../pessoas/entities/pessoa.entity';
import { Contrato } from '../../contratos/entities/contrato.entity';
import { ContaPagar } from '../../contas-pagar/entities/conta-pagar.entity';

@Entity('FORNECEDORES')
export class Fornecedor {
  @PrimaryGeneratedColumn({ name: 'id_fornecedores' })
  idFornecedor: number;

  @ManyToOne(() => Pessoa, pessoa => pessoa.fornecedores)
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: Pessoa;

  @Column({ name: 'area_atuacao', type: 'varchar', length: 255, nullable: true })
  areaAtuacao: string;

  @OneToMany(() => Contrato, contrato => contrato.fornecedor)
  contratos: Contrato[];

  @OneToMany(() => ContaPagar, contaPagar => contaPagar.fornecedor)
  contasPagar: ContaPagar[];
}
