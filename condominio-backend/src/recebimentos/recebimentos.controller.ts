import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecebimentosService } from './recebimentos.service';
import { Recebimento } from './entities/recebimento.entity';

@Controller('recebimentos')
export class RecebimentosController {
  constructor(private readonly recebimentosService: RecebimentosService) {}

  @Post()
  create(@Body() recebimento: Partial<Recebimento>) {
    return this.recebimentosService.create(recebimento);
  }

  @Get()
  findAll() {
    return this.recebimentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recebimentosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() recebimento: Partial<Recebimento>) {
    return this.recebimentosService.update(+id, recebimento);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recebimentosService.remove(+id);
  }
}
