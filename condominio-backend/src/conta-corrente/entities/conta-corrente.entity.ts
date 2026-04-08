import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { MovContaCorrente } from '../../mov-conta-corrente/entities/mov-conta-corrente.entity';

@Entity('CONTA_CORRENTE')
export class ContaCorrente {
  @PrimaryGeneratedColumn({ name: 'id_conta_corrente' })
  idContaCorrente: number;

  @Column({ name: 'banco', type: 'varchar', length: 50, nullable: true })
  banco: string;

  @Column({ name: 'agencia', type: 'varchar', length: 20, nullable: true })
  agencia: string;

  @Column({ name: 'num_conta', type: 'varchar', length: 20, nullable: true })
  numConta: string;

  @Column({ name: 'saldo_atual', type: 'decimal', precision: 12, scale: 2, nullable: true })
  saldoAtual: number;

  @OneToMany(() => MovContaCorrente, movContaCorrente => movContaCorrente.contaCorrente)
  movimentos: MovContaCorrente[];
}
