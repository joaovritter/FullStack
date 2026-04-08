import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Endereco } from './entities/endereco.entity';

@Injectable()
export class EnderecosService {
  constructor(
    @InjectRepository(Endereco)
    private enderecosRepository: Repository<Endereco>,
  ) {}

  findAll(): Promise<Endereco[]> {
    return this.enderecosRepository.find();
  }

  findOne(id: number): Promise<Endereco | null> {
    return this.enderecosRepository.findOneBy({ idEndereco: id } as any);
  }

  create(endereco: Partial<Endereco>): Promise<Endereco> {
    const novoEndereco = this.enderecosRepository.create(endereco);
    return this.enderecosRepository.save(novoEndereco);
  }

  async update(id: number, endereco: Partial<Endereco>): Promise<void> {
    await this.enderecosRepository.update(id, endereco);
  }

  async remove(id: number): Promise<void> {
    await this.enderecosRepository.delete(id);
  }
}
