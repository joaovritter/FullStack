import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, Column } from 'typeorm';
import { Pessoa } from '../../pessoas/entities/pessoa.entity';
import { Unidade } from '../../unidades/entities/unidade.entity';
import { Reserva } from '../../reservas/entities/reserva.entity';
import { Boleto } from '../../boletos/entities/boleto.entity';
import { Visita } from '../../visitas/entities/visita.entity';
import { ContaReceber } from '../../contas-receber/entities/conta-receber.entity';

@Entity('MORADORES')
export class Morador {
  @PrimaryGeneratedColumn({ name: 'ID_MORADOR' })
  ID_MORADOR: number;

  @ManyToOne(() => Pessoa, pessoa => pessoa.moradores)
  @JoinColumn({ name: 'ID_PESSOA' })
  pessoa: Pessoa;

  @Column({ name: 'ID_PESSOA' })
  ID_PESSOA: number;

  @ManyToOne(() => Unidade, unidade => unidade.moradores)
  @JoinColumn({ name: 'ID_UNIDADE' })
  unidade: Unidade;

  @Column({ name: 'ID_UNIDADE' })
  ID_UNIDADE: number;

  @OneToMany(() => Reserva, reserva => reserva.morador)
  reservas: Reserva[];

  @OneToMany(() => Boleto, boleto => boleto.morador)
  boletos: Boleto[];

  @OneToMany(() => Visita, visita => visita.moradorAutorizacao)
  visitasAutorizadas: Visita[];

  @OneToMany(() => ContaReceber, contaReceber => contaReceber.morador)
  contasReceber: ContaReceber[];
}
