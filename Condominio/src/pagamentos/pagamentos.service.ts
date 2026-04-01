import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagamento } from './entities/pagamento.entity';

@Injectable()
export class PagamentosService {
  constructor(
    @InjectRepository(Pagamento)
    private pagamentosRepository: Repository<Pagamento>,
  ) {}

  findAll(): Promise<Pagamento[]> {
    return this.pagamentosRepository.find();
  }

  findOne(id: number): Promise<Pagamento | null> {
    return this.pagamentosRepository.findOneBy({ idPagamento: id } as any);
  }

  create(pagamento: Partial<Pagamento>): Promise<Pagamento> {
    const novoPagamento = this.pagamentosRepository.create(pagamento);
    return this.pagamentosRepository.save(novoPagamento);
  }

  async update(id: number, pagamento: Partial<Pagamento>): Promise<void> {
    await this.pagamentosRepository.update(id, pagamento);
  }

  async remove(id: number): Promise<void> {
    await this.pagamentosRepository.delete(id);
  }
}
