import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { UnidadesService } from './unidades.service';
import { Unidade } from './entities/unidade.entity';

@Controller('unidades')
export class UnidadesController {
  constructor(private readonly unidadesService: UnidadesService) {}

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

  @Put(':id')
  update(@Param('id') id: string, @Body() unidade: Partial<Unidade>) {
    return this.unidadesService.update(+id, unidade);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unidadesService.remove(+id);
  }
}
