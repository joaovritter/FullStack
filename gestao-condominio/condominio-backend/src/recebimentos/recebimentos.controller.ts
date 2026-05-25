import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard'; // ajuste o caminho
import { RecebimentosService } from './recebimentos.service';
import { Recebimento } from './entities/recebimento.entity';

@Controller('recebimentos')
export class RecebimentosController {
  constructor(private readonly recebimentosService: RecebimentosService) {}

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() recebimento: Partial<Recebimento>) {
    return this.recebimentosService.update(+id, recebimento);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recebimentosService.remove(+id);
  }
}
