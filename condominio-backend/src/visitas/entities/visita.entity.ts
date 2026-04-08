import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Visitante } from '../../visitantes/entities/visitante.entity';
import { Unidade } from '../../unidades/entities/unidade.entity';
import { Morador } from '../../moradores/entities/morador.entity';

@Entity('VISITAS')
export class Visita {
  @PrimaryGeneratedColumn({ name: 'id_visita' })
  idVisita: number;

  @ManyToOne(() => Visitante, visitante => visitante.visitas)
  @JoinColumn({ name: 'id_visitante' })
  visitante: Visitante;

  @ManyToOne(() => Unidade, unidade => unidade.visitas)
  @JoinColumn({ name: 'id_unidade' })
  unidade: Unidade;

  @ManyToOne(() => Morador, morador => morador.visitasAutorizadas)
  @JoinColumn({ name: 'id_morador_autorizacao' })
  moradorAutorizacao: Morador;

  @Column({ name: 'placa_veiculo', type: 'varchar', length: 10, nullable: true })
  placaVeiculo: string;

  @Column({ name: 'data_entrada', type: 'timestamp', nullable: true })
  dataEntrada: Date;

  @Column({ name: 'data_saida', type: 'timestamp', nullable: true })
  dataSaida: Date;
}
