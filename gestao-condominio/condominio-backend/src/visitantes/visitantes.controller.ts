import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard'; // ajuste o caminho
import { VisitantesService } from './visitantes.service';
import { Visitante } from './entities/visitante.entity';

@Controller('visitantes')
export class VisitantesController {
  constructor(private readonly visitantesService: VisitantesService) {}

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() visitante: Partial<Visitante>) {
    return this.visitantesService.update(+id, visitante);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitantesService.remove(+id);
  }
}
