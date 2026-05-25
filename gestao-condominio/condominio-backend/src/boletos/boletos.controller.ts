import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { BoletosService } from './boletos.service';
import { Boleto } from './entities/boleto.entity';
import { AuthGuard } from '../auth/auth.guard'; // ajuste o caminho


@Controller('boletos')
export class BoletosController {
  constructor(private readonly boletosService: BoletosService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() boleto: Partial<Boleto>) {
    return this.boletosService.create(boleto);
  }

  @Get()
  findAll() {
    return this.boletosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boletosService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() boleto: Partial<Boleto>) {
    return this.boletosService.update(+id, boleto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boletosService.remove(+id);
  }
}
