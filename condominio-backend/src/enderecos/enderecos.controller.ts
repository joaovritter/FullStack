import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { EnderecosService } from './enderecos.service';
import { Endereco } from './entities/endereco.entity';

@Controller('enderecos')
export class EnderecosController {
  constructor(private readonly enderecosService: EnderecosService) {}

  @Post()
  create(@Body() endereco: Partial<Endereco>) {
    return this.enderecosService.create(endereco);
  }

  @Get()
  findAll() {
    return this.enderecosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enderecosService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() endereco: Partial<Endereco>) {
    return this.enderecosService.update(+id, endereco);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enderecosService.remove(+id);
  }
}
