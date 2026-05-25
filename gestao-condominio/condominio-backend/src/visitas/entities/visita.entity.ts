import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Visitante } from '../../visitantes/entities/visitante.entity';
import { Unidade } from '../../unidades/entities/unidade.entity';
import { Morador } from '../../moradores/entities/morador.entity';

@Entity('VISITAS')
export class Visita {
  @PrimaryGeneratedColumn({ name: 'ID_VISITA' })
  ID_VISITA: number;

  @ManyToOne(() => Visitante, visitante => visitante.visitas)
  @JoinColumn({ name: 'ID_VISITANTE' })
  visitante: Visitante;

  @Column({ name: 'ID_VISITANTE' })
  ID_VISITANTE: number;

  @ManyToOne(() => Unidade, unidade => unidade.visitas)
  @JoinColumn({ name: 'ID_UNIDADE' })
  unidade: Unidade;

  @Column({ name: 'ID_UNIDADE' })
  ID_UNIDADE: number;

  @ManyToOne(() => Morador, morador => morador.visitasAutorizadas)
  @JoinColumn({ name: 'ID_MORADOR' })
  moradorAutorizacao: Morador;

  @Column({ name: 'ID_MORADOR' })
  ID_MORADOR: number;

  @Column({ name: 'PLACA_VEICULO', type: 'varchar', length: 10, nullable: true })
  PLACA_VEICULO: string;

  @Column({ name: 'DATA_ENTRADA', type: 'datetime', nullable: true })
  DATA_ENTRADA: Date;

  @Column({ name: 'DATA_SAIDA', type: 'datetime', nullable: true })
  DATA_SAIDA: Date;
}
