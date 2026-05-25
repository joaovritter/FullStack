import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  async create(@Body() createUserDto: any) {
    return this.usuariosService.createUser(createUserDto);
  }
  
  // Opcional: listar usuários para teste (Cuidado com a senha no retorno!)
  @Get()
  async findAll() {
    return this.usuariosService.findAll(); 
  }
}