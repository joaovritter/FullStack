import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ComunicadosService } from './comunicados.service';
import { Comunicado } from './entities/comunicado.entity';

@Controller('comunicados')
export class ComunicadosController {
  constructor(private readonly comunicadosService: ComunicadosService) {}

  @Post()
  create(@Body() comunicado: Partial<Comunicado>) {
    return this.comunicadosService.create(comunicado);
  }

  @Get()
  findAll() {
    return this.comunicadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comunicadosService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() comunicado: Partial<Comunicado>) {
    return this.comunicadosService.update(+id, comunicado);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comunicadosService.remove(+id);
  }
}
