import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { FornecedoresService } from './fornecedores.service';
import { Fornecedor } from './entities/fornecedor.entity';

@Controller('fornecedores')
export class FornecedoresController {
  constructor(private readonly fornecedoresService: FornecedoresService) {}

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

  @Put(':id')
  update(@Param('id') id: string, @Body() fornecedor: Partial<Fornecedor>) {
    return this.fornecedoresService.update(+id, fornecedor);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fornecedoresService.remove(+id);
  }
}
