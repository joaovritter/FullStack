import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContatosService } from './contatos.service';
import { ContatosController } from './contatos.controller';
import { Contato } from './entities/contato.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contato])],
  controllers: [ContatosController],
  providers: [ContatosService],
})
export class ContatosModule {}
