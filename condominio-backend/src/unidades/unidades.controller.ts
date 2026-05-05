import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard'; // ajuste o caminho
import { UnidadesService } from './unidades.service';
import { Unidade } from './entities/unidade.entity';

@Controller('unidades')
export class UnidadesController {
  constructor(private readonly unidadesService: UnidadesService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() unidade: Partial<Unidade>) {
    return this.unidadesService.create(unidade);
  }

  @Get()
  findAll() {
    return this.unidadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unidadesService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() unidade: Partial<Unidade>) {
    return this.unidadesService.update(+id, unidade);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unidadesService.remove(+id);
  }
}
