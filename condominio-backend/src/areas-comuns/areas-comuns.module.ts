import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreasComunsService } from './areas-comuns.service';
import { AreasComunsController } from './areas-comuns.controller';
import { AreaComum } from './entities/area-comum.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AreaComum])],
  controllers: [AreasComunsController],
  providers: [AreasComunsService],
})
export class AreasComunsModule {}
