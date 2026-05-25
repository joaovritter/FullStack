Projeto Full Stack (Parte 4)
Expansão do Backend para PUT e DELETE
Objetivo
Completar o CRUD no backend NestJS, adicionando métodos de
atualização (PUT) e exclusão (DELETE) às entidades já criadas.
1. Revisão da Estrutura Atual
Até agora, cada entidade possui:
Service com findAll() e create().
Controller com @Get() e @Post().
Exemplo (Pessoas):
@Get()
findAll(): Promise<Pessoa[]> {
 return this.pessoasService.findAll();
}
@Post()
create(@Body() pessoa: Pessoa): Promise<Pessoa> {
 return this.pessoasService.create(pessoa);
}
2. Adicionar Métodos PUT e DELETE no Service
Arquivo: src/pessoas/pessoas.service.ts
async update(id: number, dados: Partial<Pessoa>): Promise<Pessoa> {
 await this.pessoasRepo.update(id, dados);
 return this.pessoasRepo.findOneBy({ ID_PESSOA: id });
}
async remove(id: number): Promise<void> {
 await this.pessoasRepo.delete(id);
}
3. Adicionar Métodos PUT e DELETE no Controller
Arquivo: src/pessoas/pessoas.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from
'@nestjs/common';
@Controller('pessoas')
export class PessoasController {
 constructor(private readonly pessoasService: PessoasService) {}
 @Get()
 findAll(): Promise<Pessoa[]> {
 return this.pessoasService.findAll();
 }
 @Post()
 create(@Body() pessoa: Pessoa): Promise<Pessoa> {
 return this.pessoasService.create(pessoa);
 }
 @Put(':id')
 update(@Param('id') id: number, @Body() dados: Partial<Pessoa>):
Promise<Pessoa> {
 return this.pessoasService.update(id, dados);
 }
 @Delete(':id')
 remove(@Param('id') id: number): Promise<void> {
 return this.pessoasService.remove(id);
 }
}
4. Replicar para Outras Entidades
Repita o mesmo padrão para:
Moradores (moradores.service.ts / moradores.controller.ts)
Reservas
Boletos
Funcionários
Fornecedores
Visitantes
Unidades
Áreas Comuns
Comunicados
Contratos
Cada service deve ter:
update(id: number, dados: Partial<Entidade>): Promise<Entidade>
remove(id: number): Promise<void>
Cada controller deve ter:
@Put(':id') update(...)
@Delete(':id') remove(...)
5. Testar com Postman
Inserir
POST http://localhost:3000/pessoas
{
 "NOME": "Maria Oliveira",
 "TIPO_PESSOA": "FISICA",
 "CPF_CNPJ": "98765432100",
 "DATA_CADASTRO": "2026-04-14"
}
Atualizar
PUT http://localhost:3000/pessoas/1
{
 "NOME": "Maria de Oliveira"
}
Excluir
DELETE http://localhost:3000/pessoas/1
Resultado Esperado
• Backend NestJS com CRUD completo (GET, POST, PUT, DELETE) para
todas as entidades.
• Frontend Next.js já preparado para consumir esses endpoints.
• Sistema funcionando localmente com operações de criação, listagem,
edição e exclusão.