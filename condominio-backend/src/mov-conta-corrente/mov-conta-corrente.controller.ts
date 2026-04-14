import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { MovContaCorrenteService } from './mov-conta-corrente.service';
import { MovContaCorrente } from './entities/mov-conta-corrente.entity';

@Controller('mov-conta-corrente')
export class MovContaCorrenteController {
  constructor(private readonly movContaCorrenteService: MovContaCorrenteService) {}

  @Post()
  create(@Body() movContaCorrente: Partial<MovContaCorrente>) {
    return this.movContaCorrenteService.create(movContaCorrente);
  }

  @Get()
  findAll() {
    return this.movContaCorrenteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movContaCorrenteService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() movContaCorrente: Partial<MovContaCorrente>) {
    return this.movContaCorrenteService.update(+id, movContaCorrente);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movContaCorrenteService.remove(+id);
  }
}
