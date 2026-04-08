import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from './pessoas/pessoas.module';
import { ContatosModule } from './contatos/contatos.module';
import { EnderecosModule } from './enderecos/enderecos.module';
import { UnidadesModule } from './unidades/unidades.module';
import { MoradoresModule } from './moradores/moradores.module';
import { FuncionariosModule } from './funcionarios/funcionarios.module';
import { FornecedoresModule } from './fornecedores/fornecedores.module';
import { VisitantesModule } from './visitantes/visitantes.module';
import { AreasComunsModule } from './areas-comuns/areas-comuns.module';
import { ReservasModule } from './reservas/reservas.module';
import { BoletosModule } from './boletos/boletos.module';
import { ComunicadosModule } from './comunicados/comunicados.module';
import { ContratosModule } from './contratos/contratos.module';
import { ContratosRhModule } from './contratos-rh/contratos-rh.module';
import { VisitasModule } from './visitas/visitas.module';
import { ContasPagarModule } from './contas-pagar/contas-pagar.module';
import { ContasReceberModule } from './contas-receber/contas-receber.module';
import { PagamentosModule } from './pagamentos/pagamentos.module';
import { RecebimentosModule } from './recebimentos/recebimentos.module';
import { ContaCorrenteModule } from './conta-corrente/conta-corrente.module';
import { MovContaCorrenteModule } from './mov-conta-corrente/mov-conta-corrente.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'www.com.brj',
      database: 'DBCONDOMINIO',
      autoLoadEntities: true,
      synchronize: false,
    }),
    PessoasModule,
    ContatosModule,
    EnderecosModule,
    UnidadesModule,
    MoradoresModule,
    FuncionariosModule,
    FornecedoresModule,
    VisitantesModule,
    AreasComunsModule,
    ReservasModule,
    BoletosModule,
    ComunicadosModule,
    ContratosModule,
    ContratosRhModule,
    VisitasModule,
    ContasPagarModule,
    ContasReceberModule,
    PagamentosModule,
    RecebimentosModule,
    ContaCorrenteModule,
    MovContaCorrenteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
