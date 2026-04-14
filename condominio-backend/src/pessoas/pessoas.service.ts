import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pessoa } from './entities/pessoa.entity';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private pessoasRepository: Repository<Pessoa>,
  ) {}

  findAll(): Promise<Pessoa[]> {
    return this.pessoasRepository.find();
  }

  findOne(id: number): Promise<Pessoa | null> {
    return this.pessoasRepository.findOneBy({ ID_PESSOA: id });
  }

  create(pessoa: Partial<Pessoa>): Promise<Pessoa> {
    const novaPessoa = this.pessoasRepository.create(pessoa);
    return this.pessoasRepository.save(novaPessoa);
  }

  async update(id: number, dados: Partial<Pessoa>): Promise<Pessoa> {
    await this.pessoasRepository.update(id, dados);
    return this.pessoasRepository.findOneBy({ ID_PESSOA: id }) as Promise<Pessoa>;
  }

  async remove(id: number): Promise<void> {
    await this.pessoasRepository.delete(id);
  }
}
