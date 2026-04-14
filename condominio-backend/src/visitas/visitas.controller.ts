import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { VisitasService } from './visitas.service';
import { Visita } from './entities/visita.entity';

@Controller('visitas')
export class VisitasController {
  constructor(private readonly visitasService: VisitasService) {}

  @Post()
  create(@Body() visita: Partial<Visita>) {
    return this.visitasService.create(visita);
  }

  @Get()
  findAll() {
    return this.visitasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitasService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() visita: Partial<Visita>) {
    return this.visitasService.update(+id, visita);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitasService.remove(+id);
  }
}
