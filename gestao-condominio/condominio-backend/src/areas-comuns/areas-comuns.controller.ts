import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { AreasComunsService } from './areas-comuns.service';
import { AreaComum } from './entities/area-comum.entity';

@Controller('areas-comuns')
export class AreasComunsController {
  constructor(private readonly areasComunsService: AreasComunsService) {}

  @Post()
  create(@Body() areaComum: Partial<AreaComum>) {
    return this.areasComunsService.create(areaComum);
  }

  @Get()
  findAll() {
    return this.areasComunsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.areasComunsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() areaComum: Partial<AreaComum>) {
    return this.areasComunsService.update(+id, areaComum);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.areasComunsService.remove(+id);
  }
}
