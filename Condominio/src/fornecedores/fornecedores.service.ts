import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fornecedor } from './entities/fornecedor.entity';

@Injectable()
export class FornecedoresService {
  constructor(
    @InjectRepository(Fornecedor)
    private fornecedoresRepository: Repository<Fornecedor>,
  ) {}

  findAll(): Promise<Fornecedor[]> {
    return this.fornecedoresRepository.find();
  }

  findOne(id: number): Promise<Fornecedor | null> {
    return this.fornecedoresRepository.findOneBy({ idFornecedor: id } as any);
  }

  create(fornecedor: Partial<Fornecedor>): Promise<Fornecedor> {
    const novoFornecedor = this.fornecedoresRepository.create(fornecedor);
    return this.fornecedoresRepository.save(novoFornecedor);
  }

  async update(id: number, fornecedor: Partial<Fornecedor>): Promise<void> {
    await this.fornecedoresRepository.update(id, fornecedor);
  }

  async remove(id: number): Promise<void> {
    await this.fornecedoresRepository.delete(id);
  }
}
