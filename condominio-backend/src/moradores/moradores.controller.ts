import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { MoradoresService } from './moradores.service';
import { Morador } from './entities/morador.entity';

@Controller('moradores')
export class MoradoresController {
  constructor(private readonly moradoresService: MoradoresService) {}

  @Post()
  create(@Body() morador: Partial<Morador>) {
    return this.moradoresService.create(morador);
  }

  @Get()
  findAll() {
    return this.moradoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moradoresService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() morador: Partial<Morador>) {
    return this.moradoresService.update(+id, morador);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moradoresService.remove(+id);
  }
}
