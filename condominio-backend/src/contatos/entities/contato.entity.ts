import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pessoa } from '../../pessoas/entities/pessoa.entity';

@Entity('CONTATOS')
export class Contato {
  @PrimaryGeneratedColumn({ name: 'id_contato' })
  idContato: number;

  @Column({ name: 'tipo_contato', type: 'varchar', length: 255 })
  tipoContato: string;

  @Column({ name: 'valor_contato', type: 'varchar', length: 255 })
  valorContato: string;

  @ManyToOne(() => Pessoa, pessoa => pessoa.contatos)
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: Pessoa;
}
