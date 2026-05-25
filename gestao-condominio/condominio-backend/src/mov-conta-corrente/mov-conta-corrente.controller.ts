import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard'; // ajuste o caminho
import { MovContaCorrenteService } from './mov-conta-corrente.service';
import { MovContaCorrente } from './entities/mov-conta-corrente.entity';

@Controller('mov-conta-corrente')
export class MovContaCorrenteController {
  constructor(private readonly movContaCorrenteService: MovContaCorrenteService) {}

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() movContaCorrente: Partial<MovContaCorrente>) {
    return this.movContaCorrenteService.update(+id, movContaCorrente);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movContaCorrenteService.remove(+id);
  }
}
