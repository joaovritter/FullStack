import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { Reserva } from './entities/reserva.entity';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  create(@Body() reserva: Partial<Reserva>) {
    return this.reservasService.create(reserva);
  }

  @Get()
  findAll() {
    return this.reservasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservasService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() reserva: Partial<Reserva>) {
    return this.reservasService.update(+id, reserva);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservasService.remove(+id);
  }
}
