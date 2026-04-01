import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contato } from './entities/contato.entity';

@Injectable()
export class ContatosService {
  constructor(
    @InjectRepository(Contato)
    private contatosRepository: Repository<Contato>,
  ) {}

  findAll(): Promise<Contato[]> {
    return this.contatosRepository.find();
  }

  findOne(id: number): Promise<Contato | null> {
    return this.contatosRepository.findOneBy({ idContato: id } as any);
  }

  create(contato: Partial<Contato>): Promise<Contato> {
    const novoContato = this.contatosRepository.create(contato);
    return this.contatosRepository.save(novoContato);
  }

  async update(id: number, contato: Partial<Contato>): Promise<void> {
    await this.contatosRepository.update(id, contato);
  }

  async remove(id: number): Promise<void> {
    await this.contatosRepository.delete(id);
  }
}
