import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContratoRH } from './entities/contrato-rh.entity';

@Injectable()
export class ContratosRhService {
  constructor(
    @InjectRepository(ContratoRH)
    private contratosRhRepository: Repository<ContratoRH>,
  ) {}

  findAll(): Promise<ContratoRH[]> {
    return this.contratosRhRepository.find();
  }

  findOne(id: number): Promise<ContratoRH | null> {
    return this.contratosRhRepository.findOneBy({ idContratoRh: id } as any);
  }

  create(contratoRh: Partial<ContratoRH>): Promise<ContratoRH> {
    const novoContratoRh = this.contratosRhRepository.create(contratoRh);
    return this.contratosRhRepository.save(novoContratoRh);
  }

  async update(id: number, contratoRh: Partial<ContratoRH>): Promise<void> {
    await this.contratosRhRepository.update(id, contratoRh);
  }

  async remove(id: number): Promise<void> {
    await this.contratosRhRepository.delete(id);
  }
}
