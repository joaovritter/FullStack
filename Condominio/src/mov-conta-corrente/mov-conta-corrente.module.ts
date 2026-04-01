import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovContaCorrenteService } from './mov-conta-corrente.service';
import { MovContaCorrenteController } from './mov-conta-corrente.controller';
import { MovContaCorrente } from './entities/mov-conta-corrente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovContaCorrente])],
  controllers: [MovContaCorrenteController],
  providers: [MovContaCorrenteService],
})
export class MovContaCorrenteModule {}
