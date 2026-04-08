import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContatosService } from './contatos.service';
import { Contato } from './entities/contato.entity';

@Controller('contatos')
export class ContatosController {
  constructor(private readonly contatosService: ContatosService) {}

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() contato: Partial<Contato>) {
    return this.contatosService.update(+id, contato);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contatosService.remove(+id);
  }
}
