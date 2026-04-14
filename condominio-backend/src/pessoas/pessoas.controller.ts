import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PessoasService } from './pessoas.service';
import { Pessoa } from './entities/pessoa.entity';

@Controller('pessoas')
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) {}

  @Post()
  create(@Body() pessoa: Partial<Pessoa>) {
    return this.pessoasService.create(pessoa);
  }

  @Get()
  findAll() {
    return this.pessoasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pessoasService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dados: Partial<Pessoa>) {
    return this.pessoasService.update(+id, dados);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pessoasService.remove(+id);
  }
}
