import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recebimento } from './entities/recebimento.entity';

@Injectable()
export class RecebimentosService {
  constructor(
    @InjectRepository(Recebimento)
    private recebimentosRepository: Repository<Recebimento>,
  ) {}

  findAll(): Promise<Recebimento[]> {
    return this.recebimentosRepository.find();
  }

  findOne(id: number): Promise<Recebimento | null> {
    return this.recebimentosRepository.findOneBy({ idRecebimento: id } as any);
  }

  create(recebimento: Partial<Recebimento>): Promise<Recebimento> {
    const novoRecebimento = this.recebimentosRepository.create(recebimento);
    return this.recebimentosRepository.save(novoRecebimento);
  }

  async update(id: number, recebimento: Partial<Recebimento>): Promise<void> {
    await this.recebimentosRepository.update(id, recebimento);
  }

  async remove(id: number): Promise<void> {
    await this.recebimentosRepository.delete(id);
  }
}
