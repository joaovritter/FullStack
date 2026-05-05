import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard'; // ajuste o caminho
import { ContratosRhService } from './contratos-rh.service';
import { ContratoRH } from './entities/contrato-rh.entity';

@Controller('contratos-rh')
export class ContratosRhController {
  constructor(private readonly contratosRhService: ContratosRhService) {}

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() contratoRh: Partial<ContratoRH>) {
    return this.contratosRhService.update(+id, contratoRh);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contratosRhService.remove(+id);
  }
}
