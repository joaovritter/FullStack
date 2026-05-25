import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard'; // ajuste o caminho
import { PagamentosService } from './pagamentos.service';
import { Pagamento } from './entities/pagamento.entity';

@Controller('pagamentos')
export class PagamentosController {
  constructor(private readonly pagamentosService: PagamentosService) {}

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() pagamento: Partial<Pagamento>) {
    return this.pagamentosService.update(+id, pagamento);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pagamentosService.remove(+id);
  }
}
