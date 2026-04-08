import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unidade } from './entities/unidade.entity';

@Injectable()
export class UnidadesService {
  constructor(
    @InjectRepository(Unidade)
    private unidadesRepository: Repository<Unidade>,
  ) {}

  findAll(): Promise<Unidade[]> {
    return this.unidadesRepository.find();
  }

  findOne(id: number): Promise<Unidade | null> {
    return this.unidadesRepository.findOneBy({ idUnidade: id } as any);
  }

  create(unidade: Partial<Unidade>): Promise<Unidade> {
    const novaUnidade = this.unidadesRepository.create(unidade);
    return this.unidadesRepository.save(novaUnidade);
  }

  async update(id: number, unidade: Partial<Unidade>): Promise<void> {
    await this.unidadesRepository.update(id, unidade);
  }

  async remove(id: number): Promise<void> {
    await this.unidadesRepository.delete(id);
  }
}
