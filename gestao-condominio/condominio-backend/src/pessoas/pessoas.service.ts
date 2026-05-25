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

  // Converter data para formato correto (YYYY-MM-DD)
  private formatarData(data: any): string | null {
    if (!data) return null;
    
    if (typeof data === 'string') {
      // Se já é string YYYY-MM-DD, retorna como está
      if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        return data;
      }
      // Se é ISO string (contém T), extrair apenas a data
      if (data.includes('T')) {
        return data.split('T')[0];
      }
    }
    
    if (data instanceof Date) {
      return data.toISOString().split('T')[0];
    }
    
    return null;
  }

  create(pessoa: Partial<Pessoa>): Promise<Pessoa> {
    // Formatar DATA_CADASTRO se existir
    if (pessoa.DATA_CADASTRO) {
      pessoa.DATA_CADASTRO = this.formatarData(pessoa.DATA_CADASTRO) as any;
    } else {
      // Se não foi fornecida, usar data de hoje
      pessoa.DATA_CADASTRO = new Date().toISOString().split('T')[0] as any;
    }
    
    const novaPessoa = this.pessoasRepository.create(pessoa);
    return this.pessoasRepository.save(novaPessoa);
  }

  async update(id: number, dados: Partial<Pessoa>): Promise<Pessoa> {
    // Formatar DATA_CADASTRO se existir
    if (dados.DATA_CADASTRO) {
      dados.DATA_CADASTRO = this.formatarData(dados.DATA_CADASTRO) as any;
    }
    
    await this.pessoasRepository.update(id, dados);
    return this.pessoasRepository.findOneBy({ ID_PESSOA: id } as any) as Promise<Pessoa>;
  }

  async remove(id: number): Promise<void> {
    await this.pessoasRepository.delete(id);
  }
}
