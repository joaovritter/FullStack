import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
    private configService: ConfigService, // Injeção necessária para ler o .env
  ) {}

  async login(dto: any) {
    // 1. Busca o usuário
    const user = await this.usuariosService.findByCpfCnpj(dto.CPF_CNPJ);
    
    // 2. Valida usuário e senha
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // 3. Prepara o Payload
    const payload = { 
      sub: user.ID_PESSOA, 
      nome: user.NOME 
    };
    
    // 4. Gera o token passando a secret explicitamente para evitar o erro de 'undefined'
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
      }),
    };
  }
}