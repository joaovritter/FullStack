import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visita } from './entities/visita.entity';

@Injectable()
export class VisitasService {
  constructor(
    @InjectRepository(Visita)
    private visitasRepository: Repository<Visita>,
  ) {}

  findAll(): Promise<Visita[]> {
    return this.visitasRepository.find();
  }

  findOne(id: number): Promise<Visita | null> {
    return this.visitasRepository.findOneBy({ idVisita: id } as any);
  }

  create(visita: Partial<Visita>): Promise<Visita> {
    const novaVisita = this.visitasRepository.create(visita);
    return this.visitasRepository.save(novaVisita);
  }

  async update(id: number, visita: Partial<Visita>): Promise<void> {
    await this.visitasRepository.update(id, visita);
  }

  async remove(id: number): Promise<void> {
    await this.visitasRepository.delete(id);
  }
}
