import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard'; // ajuste o caminho
import { ContaCorrenteService } from './conta-corrente.service';
import { ContaCorrente } from './entities/conta-corrente.entity';

@Controller('conta-corrente')
export class ContaCorrenteController {
  constructor(private readonly contaCorrenteService: ContaCorrenteService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() contaCorrente: Partial<ContaCorrente>) {
    return this.contaCorrenteService.create(contaCorrente);
  }

  @Get()
  findAll() {
    return this.contaCorrenteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contaCorrenteService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() contaCorrente: Partial<ContaCorrente>) {
    return this.contaCorrenteService.update(+id, contaCorrente);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contaCorrenteService.remove(+id);
  }
}
