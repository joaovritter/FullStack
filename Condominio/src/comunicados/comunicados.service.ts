import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comunicado } from './entities/comunicado.entity';

@Injectable()
export class ComunicadosService {
  constructor(
    @InjectRepository(Comunicado)
    private comunicadosRepository: Repository<Comunicado>,
  ) {}

  findAll(): Promise<Comunicado[]> {
    return this.comunicadosRepository.find();
  }

  findOne(id: number): Promise<Comunicado | null> {
    return this.comunicadosRepository.findOneBy({ idComunicado: id } as any);
  }

  create(comunicado: Partial<Comunicado>): Promise<Comunicado> {
    const novoComunicado = this.comunicadosRepository.create(comunicado);
    return this.comunicadosRepository.save(novoComunicado);
  }

  async update(id: number, comunicado: Partial<Comunicado>): Promise<void> {
    await this.comunicadosRepository.update(id, comunicado);
  }

  async remove(id: number): Promise<void> {
    await this.comunicadosRepository.delete(id);
  }
}
