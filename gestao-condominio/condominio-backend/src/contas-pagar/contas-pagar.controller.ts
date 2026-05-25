import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard'; // ajuste o caminho
import { ContasPagarService } from './contas-pagar.service';
import { ContaPagar } from './entities/conta-pagar.entity';

@Controller('contas-pagar')
export class ContasPagarController {
  constructor(private readonly contasPagarService: ContasPagarService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() contaPagar: Partial<ContaPagar>) {
    return this.contasPagarService.create(contaPagar);
  }

  @Get()
  findAll() {
    return this.contasPagarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contasPagarService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() contaPagar: Partial<ContaPagar>) {
    return this.contasPagarService.update(+id, contaPagar);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contasPagarService.remove(+id);
  }
}
