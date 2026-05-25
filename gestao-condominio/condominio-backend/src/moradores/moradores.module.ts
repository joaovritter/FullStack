import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoradoresService } from './moradores.service';
import { MoradoresController } from './moradores.controller';
import { Morador } from './entities/morador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Morador])],
  controllers: [MoradoresController],
  providers: [MoradoresService],
})
export class MoradoresModule {}
