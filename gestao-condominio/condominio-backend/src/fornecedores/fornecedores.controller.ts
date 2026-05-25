import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard'; // ajuste o caminho
import { FornecedoresService } from './fornecedores.service';
import { Fornecedor } from './entities/fornecedor.entity';

@Controller('fornecedores')
export class FornecedoresController {
  constructor(private readonly fornecedoresService: FornecedoresService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() fornecedor: Partial<Fornecedor>) {
    return this.fornecedoresService.create(fornecedor);
  }

  @Get()
  findAll() {
    return this.fornecedoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fornecedoresService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() fornecedor: Partial<Fornecedor>) {
    return this.fornecedoresService.update(+id, fornecedor);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fornecedoresService.remove(+id);
  }
}
