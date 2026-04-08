import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContasPagarService } from './contas-pagar.service';
import { ContaPagar } from './entities/conta-pagar.entity';

@Controller('contas-pagar')
export class ContasPagarController {
  constructor(private readonly contasPagarService: ContasPagarService) {}

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() contaPagar: Partial<ContaPagar>) {
    return this.contasPagarService.update(+id, contaPagar);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contasPagarService.remove(+id);
  }
}
