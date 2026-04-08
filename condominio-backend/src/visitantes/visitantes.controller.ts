import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VisitantesService } from './visitantes.service';
import { Visitante } from './entities/visitante.entity';

@Controller('visitantes')
export class VisitantesController {
  constructor(private readonly visitantesService: VisitantesService) {}

  @Post()
  create(@Body() visitante: Partial<Visitante>) {
    return this.visitantesService.create(visitante);
  }

  @Get()
  findAll() {
    return this.visitantesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitantesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() visitante: Partial<Visitante>) {
    return this.visitantesService.update(+id, visitante);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitantesService.remove(+id);
  }
}
