import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ContratosService } from './contratos.service';
import { Contrato } from './entities/contrato.entity';

@Controller('contratos')
export class ContratosController {
  constructor(private readonly contratosService: ContratosService) {}

  @Post()
  create(@Body() contrato: Partial<Contrato>) {
    return this.contratosService.create(contrato);
  }

  @Get()
  findAll() {
    return this.contratosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contratosService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() contrato: Partial<Contrato>) {
    return this.contratosService.update(+id, contrato);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contratosService.remove(+id);
  }
}
