import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecebimentosService } from './recebimentos.service';
import { RecebimentosController } from './recebimentos.controller';
import { Recebimento } from './entities/recebimento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recebimento])],
  controllers: [RecebimentosController],
  providers: [RecebimentosService],
})
export class RecebimentosModule {}
