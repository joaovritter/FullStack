import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Contato } from '../../contatos/entities/contato.entity';
import { Endereco } from '../../enderecos/entities/endereco.entity';
import { Morador } from '../../moradores/entities/morador.entity';
import { Funcionario } from '../../funcionarios/entities/funcionario.entity';
import { Fornecedor } from '../../fornecedores/entities/fornecedor.entity';
import { Visitante } from '../../visitantes/entities/visitante.entity';

@Entity('PESSOAS')
export class Pessoa {
  @PrimaryGeneratedColumn({ name: 'ID_PESSOA' })
  ID_PESSOA: number;

  @Column({ name: 'NOME', type: 'varchar', length: 55 })
  NOME: string;

  @Column({ name: 'TIPO_PESSOA', type: 'enum', enum: ['FISICA', 'JURIDICA'] })
  TIPO_PESSOA: string;

  @Column({ name: 'CPF_CNPJ', type: 'varchar', length: 14 })
  CPF_CNPJ: string;

  @Column({ name: 'DATA_CADASTRO', type: 'date', nullable: true })
  DATA_CADASTRO: Date;

  @OneToMany(() => Contato, contato => contato.pessoa)
  contatos: Contato[];

  @OneToMany(() => Endereco, endereco => endereco.pessoa)
  enderecos: Endereco[];

  @OneToMany(() => Morador, morador => morador.pessoa)
  moradores: Morador[];

  @OneToMany(() => Funcionario, funcionario => funcionario.pessoa)
  funcionarios: Funcionario[];

  @OneToMany(() => Fornecedor, fornecedor => fornecedor.pessoa)
  fornecedores: Fornecedor[];

  @OneToMany(() => Visitante, visitante => visitante.pessoa)
  visitantes: Visitante[];
}
