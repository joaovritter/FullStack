import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private userRepo: Repository<Usuario>,
  ) {}

  async createUser(dto: any) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    const user = this.userRepo.create({ ...dto, password: hashedPassword });
    return this.userRepo.save(user);
  }

  async findByCpfCnpj(cpf_cnpj: string) {
    return this.userRepo.findOneBy({ CPF_CNPJ: cpf_cnpj } as any);
  }

  async findAll() {
    return this.userRepo.find();
  }
}