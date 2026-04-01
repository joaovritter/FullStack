import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContaPagar } from './entities/conta-pagar.entity';

@Injectable()
export class ContasPagarService {
  constructor(
    @InjectRepository(ContaPagar)
    private contasPagarRepository: Repository<ContaPagar>,
  ) {}

  findAll(): Promise<ContaPagar[]> {
    return this.contasPagarRepository.find();
  }

  findOne(id: number): Promise<ContaPagar | null> {
    return this.contasPagarRepository.findOneBy({ idContaPagar: id } as any);
  }

  create(contaPagar: Partial<ContaPagar>): Promise<ContaPagar> {
    const novaContaPagar = this.contasPagarRepository.create(contaPagar);
    return this.contasPagarRepository.save(novaContaPagar);
  }

  async update(id: number, contaPagar: Partial<ContaPagar>): Promise<void> {
    await this.contasPagarRepository.update(id, contaPagar);
  }

  async remove(id: number): Promise<void> {
    await this.contasPagarRepository.delete(id);
  }
}
