import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AreaComum } from './entities/area-comum.entity';

@Injectable()
export class AreasComunsService {
  constructor(
    @InjectRepository(AreaComum)
    private areasComunsRepository: Repository<AreaComum>,
  ) {}

  findAll(): Promise<AreaComum[]> {
    return this.areasComunsRepository.find();
  }

  findOne(id: number): Promise<AreaComum | null> {
    return this.areasComunsRepository.findOneBy({ idAreaComum: id } as any);
  }

  create(areaComum: Partial<AreaComum>): Promise<AreaComum> {
    const novaAreaComum = this.areasComunsRepository.create(areaComum);
    return this.areasComunsRepository.save(novaAreaComum);
  }

  async update(id: number, areaComum: Partial<AreaComum>): Promise<void> {
    await this.areasComunsRepository.update(id, areaComum);
  }

  async remove(id: number): Promise<void> {
    await this.areasComunsRepository.delete(id);
  }
}
