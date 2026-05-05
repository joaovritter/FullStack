import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard'; // ajuste o caminho
import { ContatosService } from './contatos.service';
import { Contato } from './entities/contato.entity';

@Controller('contatos')
export class ContatosController {
  constructor(private readonly contatosService: ContatosService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() contato: Partial<Contato>) {
    return this.contatosService.create(contato);
  }

  @Get()
  findAll() {
    return this.contatosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contatosService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() contato: Partial<Contato>) {
    return this.contatosService.update(+id, contato);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contatosService.remove(+id);
  }
}
