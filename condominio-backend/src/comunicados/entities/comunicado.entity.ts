import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('COMUNICADOS')
export class Comunicado {
  @PrimaryGeneratedColumn({ name: 'id_comunicado' })
  idComunicado: number;

  @Column({ name: 'titulo', type: 'varchar', length: 255 })
  titulo: string;

  @Column({ name: 'mensagem', type: 'text' })
  mensagem: string;

  @Column({ name: 'dt_comunicado', type: 'date' })
  dtComunicado: Date;

  @Column({ name: 'hr_comunicado', type: 'time', nullable: true })
  hrComunicado: string;

  @Column({ name: 'tipo', type: 'varchar', length: 30, nullable: true })
  tipo: string;
}
