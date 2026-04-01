import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Funcionario } from './entities/funcionario.entity';

@Injectable()
export class FuncionariosService {
  constructor(
    @InjectRepository(Funcionario)
    private funcionariosRepository: Repository<Funcionario>,
  ) {}

  findAll(): Promise<Funcionario[]> {
    return this.funcionariosRepository.find();
  }

  findOne(id: number): Promise<Funcionario | null> {
    return this.funcionariosRepository.findOneBy({ idFuncionario: id } as any);
  }

  create(funcionario: Partial<Funcionario>): Promise<Funcionario> {
    const novoFuncionario = this.funcionariosRepository.create(funcionario);
    return this.funcionariosRepository.save(novoFuncionario);
  }

  async update(id: number, funcionario: Partial<Funcionario>): Promise<void> {
    await this.funcionariosRepository.update(id, funcionario);
  }

  async remove(id: number): Promise<void> {
    await this.funcionariosRepository.delete(id);
  }
}
