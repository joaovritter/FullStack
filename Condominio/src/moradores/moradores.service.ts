import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Morador } from './entities/morador.entity';

@Injectable()
export class MoradoresService {
  constructor(
    @InjectRepository(Morador)
    private moradoresRepository: Repository<Morador>,
  ) {}

  findAll(): Promise<Morador[]> {
    return this.moradoresRepository.find();
  }

  findOne(id: number): Promise<Morador | null> {
    return this.moradoresRepository.findOneBy({ idMorador: id } as any);
  }

  create(morador: Partial<Morador>): Promise<Morador> {
    const novoMorador = this.moradoresRepository.create(morador);
    return this.moradoresRepository.save(novoMorador);
  }

  async update(id: number, morador: Partial<Morador>): Promise<void> {
    await this.moradoresRepository.update(id, morador);
  }

  async remove(id: number): Promise<void> {
    await this.moradoresRepository.delete(id);
  }
}
