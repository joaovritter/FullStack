import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContaCorrenteService } from './conta-corrente.service';
import { ContaCorrenteController } from './conta-corrente.controller';
import { ContaCorrente } from './entities/conta-corrente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContaCorrente])],
  controllers: [ContaCorrenteController],
  providers: [ContaCorrenteService],
})
export class ContaCorrenteModule {}
