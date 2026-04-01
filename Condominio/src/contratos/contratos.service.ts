import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contrato } from './entities/contrato.entity';

@Injectable()
export class ContratosService {
  constructor(
    @InjectRepository(Contrato)
    private contratosRepository: Repository<Contrato>,
  ) {}

  findAll(): Promise<Contrato[]> {
    return this.contratosRepository.find();
  }

  findOne(id: number): Promise<Contrato | null> {
    return this.contratosRepository.findOneBy({ idContrato: id } as any);
  }

  create(contrato: Partial<Contrato>): Promise<Contrato> {
    const novoContrato = this.contratosRepository.create(contrato);
    return this.contratosRepository.save(novoContrato);
  }

  async update(id: number, contrato: Partial<Contrato>): Promise<void> {
    await this.contratosRepository.update(id, contrato);
  }

  async remove(id: number): Promise<void> {
    await this.contratosRepository.delete(id);
  }
}
