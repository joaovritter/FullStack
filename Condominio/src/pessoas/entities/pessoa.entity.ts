import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Contato } from '../../contatos/entities/contato.entity';
import { Endereco } from '../../enderecos/entities/endereco.entity';
import { Morador } from '../../moradores/entities/morador.entity';
import { Funcionario } from '../../funcionarios/entities/funcionario.entity';
import { Fornecedor } from '../../fornecedores/entities/fornecedor.entity';
import { Visitante } from '../../visitantes/entities/visitante.entity';

@Entity('PESSOAS')
export class Pessoa {
  @PrimaryGeneratedColumn({ name: 'id_pessoa' })
  idPessoa: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome: string;

  @Column({ name: 'tipo_pessoa', type: 'enum', enum: ['fisica', 'juridica'], nullable: true })
  tipoPessoa: string;

  @Column({ name: 'cpf_cnpj', type: 'varchar', length: 255, unique: true, nullable: true })
  cpfCnpj: string;

  @Column({ name: 'data_cadastro', type: 'date', nullable: true })
  dataCadastro: Date;

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
