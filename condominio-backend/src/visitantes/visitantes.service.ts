import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visitante } from './entities/visitante.entity';

@Injectable()
export class VisitantesService {
  constructor(
    @InjectRepository(Visitante)
    private visitantesRepository: Repository<Visitante>,
  ) {}

  findAll(): Promise<Visitante[]> {
    return this.visitantesRepository.find();
  }

  findOne(id: number): Promise<Visitante | null> {
    return this.visitantesRepository.findOneBy({ idVisitante: id } as any);
  }

  create(visitante: Partial<Visitante>): Promise<Visitante> {
    const novoVisitante = this.visitantesRepository.create(visitante);
    return this.visitantesRepository.save(novoVisitante);
  }

  async update(id: number, visitante: Partial<Visitante>): Promise<void> {
    await this.visitantesRepository.update(id, visitante);
  }

  async remove(id: number): Promise<void> {
    await this.visitantesRepository.delete(id);
  }
}
