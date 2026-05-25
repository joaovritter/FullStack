import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pessoa } from '../../pessoas/entities/pessoa.entity';

@Entity('ENDERECOS')
export class Endereco {
  @PrimaryGeneratedColumn({ name: 'ID_ENDERECO' })
  ID_ENDERECO: number;

  @ManyToOne(() => Pessoa, pessoa => pessoa.enderecos)
  @JoinColumn({ name: 'ID_PESSOA' })
  pessoa: Pessoa;

  @Column({ name: 'ID_PESSOA' })
  ID_PESSOA: number;

  @Column({ name: 'LOGRADOURO', type: 'varchar', length: 255 })
  LOGRADOURO: string;

  @Column({ name: 'NUMERO', type: 'int' })
  NUMERO: number;

  @Column({ name: 'BAIRRO', type: 'varchar', length: 255 })
  BAIRRO: string;

  @Column({ name: 'CIDADE', type: 'varchar', length: 255 })
  CIDADE: string;

  @Column({ name: 'UF', type: 'char', length: 2 })
  UF: string;

  @Column({ name: 'CEP', type: 'char', length: 8 })
  CEP: string;
}
