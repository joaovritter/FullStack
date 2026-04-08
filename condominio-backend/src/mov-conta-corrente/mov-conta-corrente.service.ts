import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovContaCorrente } from './entities/mov-conta-corrente.entity';

@Injectable()
export class MovContaCorrenteService {
  constructor(
    @InjectRepository(MovContaCorrente)
    private movContaCorrenteRepository: Repository<MovContaCorrente>,
  ) {}

  findAll(): Promise<MovContaCorrente[]> {
    return this.movContaCorrenteRepository.find();
  }

  findOne(id: number): Promise<MovContaCorrente | null> {
    return this.movContaCorrenteRepository.findOneBy({ idMovimento: id } as any);
  }

  create(movContaCorrente: Partial<MovContaCorrente>): Promise<MovContaCorrente> {
    const novoMovContaCorrente = this.movContaCorrenteRepository.create(movContaCorrente);
    return this.movContaCorrenteRepository.save(novoMovContaCorrente);
  }

  async update(id: number, movContaCorrente: Partial<MovContaCorrente>): Promise<void> {
    await this.movContaCorrenteRepository.update(id, movContaCorrente);
  }

  async remove(id: number): Promise<void> {
    await this.movContaCorrenteRepository.delete(id);
  }
}
