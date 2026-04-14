import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { FuncionariosService } from './funcionarios.service';
import { Funcionario } from './entities/funcionario.entity';

@Controller('funcionarios')
export class FuncionariosController {
  constructor(private readonly funcionariosService: FuncionariosService) {}

  @Post()
  create(@Body() funcionario: Partial<Funcionario>) {
    return this.funcionariosService.create(funcionario);
  }

  @Get()
  findAll() {
    return this.funcionariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.funcionariosService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() funcionario: Partial<Funcionario>) {
    return this.funcionariosService.update(+id, funcionario);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.funcionariosService.remove(+id);
  }
}
