import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContaCorrente } from './entities/conta-corrente.entity';

@Injectable()
export class ContaCorrenteService {
  constructor(
    @InjectRepository(ContaCorrente)
    private contaCorrenteRepository: Repository<ContaCorrente>,
  ) {}

  findAll(): Promise<ContaCorrente[]> {
    return this.contaCorrenteRepository.find();
  }

  findOne(id: number): Promise<ContaCorrente | null> {
    return this.contaCorrenteRepository.findOneBy({ idContaCorrente: id } as any);
  }

  create(contaCorrente: Partial<ContaCorrente>): Promise<ContaCorrente> {
    const novaContaCorrente = this.contaCorrenteRepository.create(contaCorrente);
    return this.contaCorrenteRepository.save(novaContaCorrente);
  }

  async update(id: number, contaCorrente: Partial<ContaCorrente>): Promise<void> {
    await this.contaCorrenteRepository.update(id, contaCorrente);
  }

  async remove(id: number): Promise<void> {
    await this.contaCorrenteRepository.delete(id);
  }
}
