import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('COMUNICADOS')
export class Comunicado {
  @PrimaryGeneratedColumn({ name: 'ID_COMUNICADO' })
  ID_COMUNICADO: number;

  @Column({ name: 'TITULO', type: 'varchar', length: 50 })
  TITULO: string;

  @Column({ name: 'MENSAGEM', type: 'varchar', length: 255 })
  MENSAGEM: string;

  @Column({ name: 'DT_COMUNICADO', type: 'date' })
  DT_COMUNICADO: Date;

  @Column({ name: 'HR_COMUNICADO', type: 'time', nullable: true })
  HR_COMUNICADO: string;

  @Column({ name: 'TIPO', type: 'enum', enum: ['AVISO', 'COMUNICADO', 'NOTIFICAÇÃO', 'URGENTE'], nullable: true })
  TIPO: string;
}
