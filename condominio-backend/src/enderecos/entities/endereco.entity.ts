import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pessoa } from '../../pessoas/entities/pessoa.entity';

@Entity('ENDERECOS')
export class Endereco {
  @PrimaryGeneratedColumn({ name: 'id_enderecos' })
  idEndereco: number;

  @ManyToOne(() => Pessoa, pessoa => pessoa.enderecos)
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: Pessoa;

  @Column({ name: 'logradouro', type: 'varchar', length: 255 })
  logradouro: string;

  @Column({ name: 'numero', type: 'int' })
  numero: number;

  @Column({ name: 'bairro', type: 'varchar', length: 255 })
  bairro: string;

  @Column({ name: 'cidade', type: 'varchar', length: 255 })
  cidade: string;

  @Column({ name: 'uf', type: 'char', length: 2 })
  uf: string;

  @Column({ name: 'cep', type: 'char', length: 8 })
  cep: string;
}
