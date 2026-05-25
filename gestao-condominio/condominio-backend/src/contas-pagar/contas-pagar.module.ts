import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContasPagarService } from './contas-pagar.service';
import { ContasPagarController } from './contas-pagar.controller';
import { ContaPagar } from './entities/conta-pagar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContaPagar])],
  controllers: [ContasPagarController],
  providers: [ContasPagarService],
})
export class ContasPagarModule {}
