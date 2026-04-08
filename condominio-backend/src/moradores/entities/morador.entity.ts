import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Pessoa } from '../../pessoas/entities/pessoa.entity';
import { Unidade } from '../../unidades/entities/unidade.entity';
import { Reserva } from '../../reservas/entities/reserva.entity';
import { Boleto } from '../../boletos/entities/boleto.entity';
import { Visita } from '../../visitas/entities/visita.entity';
import { ContaReceber } from '../../contas-receber/entities/conta-receber.entity';

@Entity('MORADORES')
export class Morador {
  @PrimaryGeneratedColumn({ name: 'id_morador' })
  idMorador: number;

  @ManyToOne(() => Pessoa, pessoa => pessoa.moradores)
  @JoinColumn({ name: 'id_pessoa' })
  pessoa: Pessoa;

  @ManyToOne(() => Unidade, unidade => unidade.moradores)
  @JoinColumn({ name: 'id_unidade' })
  unidade: Unidade;

  @OneToMany(() => Reserva, reserva => reserva.morador)
  reservas: Reserva[];

  @OneToMany(() => Boleto, boleto => boleto.morador)
  boletos: Boleto[];

  @OneToMany(() => Visita, visita => visita.moradorAutorizacao)
  visitasAutorizadas: Visita[];

  @OneToMany(() => ContaReceber, contaReceber => contaReceber.morador)
  contasReceber: ContaReceber[];
}
