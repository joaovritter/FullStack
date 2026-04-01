import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boleto } from './entities/boleto.entity';

@Injectable()
export class BoletosService {
  constructor(
    @InjectRepository(Boleto)
    private boletosRepository: Repository<Boleto>,
  ) {}

  findAll(): Promise<Boleto[]> {
    return this.boletosRepository.find();
  }

  findOne(id: number): Promise<Boleto | null> {
    return this.boletosRepository.findOneBy({ idBoleto: id } as any);
  }

  create(boleto: Partial<Boleto>): Promise<Boleto> {
    const novoBoleto = this.boletosRepository.create(boleto);
    return this.boletosRepository.save(novoBoleto);
  }

  async update(id: number, boleto: Partial<Boleto>): Promise<void> {
    await this.boletosRepository.update(id, boleto);
  }

  async remove(id: number): Promise<void> {
    await this.boletosRepository.delete(id);
  }
}
