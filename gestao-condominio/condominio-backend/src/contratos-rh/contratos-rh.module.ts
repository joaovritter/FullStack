import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContratosRhService } from './contratos-rh.service';
import { ContratosRhController } from './contratos-rh.controller';
import { ContratoRH } from './entities/contrato-rh.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContratoRH])],
  controllers: [ContratosRhController],
  providers: [ContratosRhService],
})
export class ContratosRhModule {}
