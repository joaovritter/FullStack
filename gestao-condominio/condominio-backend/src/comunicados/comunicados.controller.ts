import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ComunicadosService } from './comunicados.service';
import { Comunicado } from './entities/comunicado.entity';
import { AuthGuard } from '../auth/auth.guard'; // ajuste o caminho

@Controller('comunicados')
export class ComunicadosController {
  constructor(private readonly comunicadosService: ComunicadosService) {}

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() comunicado: Partial<Comunicado>) {
    return this.comunicadosService.update(+id, comunicado);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comunicadosService.remove(+id);
  }
}
