import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContratosRhService } from './contratos-rh.service';
import { ContratoRH } from './entities/contrato-rh.entity';

@Controller('contratos-rh')
export class ContratosRhController {
  constructor(private readonly contratosRhService: ContratosRhService) {}

  @Post()
  create(@Body() contratoRh: Partial<ContratoRH>) {
    return this.contratosRhService.create(contratoRh);
  }

  @Get()
  findAll() {
    return this.contratosRhService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contratosRhService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() contratoRh: Partial<ContratoRH>) {
    return this.contratosRhService.update(+id, contratoRh);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contratosRhService.remove(+id);
  }
}
