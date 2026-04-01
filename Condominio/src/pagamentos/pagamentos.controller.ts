import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PagamentosService } from './pagamentos.service';
import { Pagamento } from './entities/pagamento.entity';

@Controller('pagamentos')
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}

  @Post()
  create(@Body() pagamento: Partial<Pagamento>) {
    return this.pagamentosService.create(pagamento);
  }

  @Get()
  findAll() {
    return this.pagamentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagamentosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() pagamento: Partial<Pagamento>) {
    return this.pagamentosService.update(+id, pagamento);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagamentosService.remove(+id);
  }
}
