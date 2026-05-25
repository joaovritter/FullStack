import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard'; // ajuste o caminho
import { ContasReceberService } from './contas-receber.service';
import { ContaReceber } from './entities/conta-receber.entity';

@Controller('contas-receber')
export class ContasReceberController {
  constructor(private readonly contasReceberService: ContasReceberService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() contaReceber: Partial<ContaReceber>) {
    return this.contasReceberService.create(contaReceber);
  }

  @Get()
  findAll() {
    return this.contasReceberService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contasReceberService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() contaReceber: Partial<ContaReceber>) {
    return this.contasReceberService.update(+id, contaReceber);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contasReceberService.remove(+id);
  }
}
