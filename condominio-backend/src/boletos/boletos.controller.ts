import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoletosService } from './boletos.service';
import { Boleto } from './entities/boleto.entity';

@Controller('boletos')
export class BoletosController {
  constructor(private readonly boletosService: BoletosService) {}

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() boleto: Partial<Boleto>) {
    return this.boletosService.update(+id, boleto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boletosService.remove(+id);
  }
}
