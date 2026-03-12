Este projeto é uma API RESTful desenvolvida com AdonisJS 6 usando TypeScript. Ele segue princípios de Clean Architecture e boas práticas de organização de código.

## Tecnologias e Ferramentas:

- Node.js (v21+)
- AdonisJS 6
- PostgreSQL
- Docker (para containers)
- Insomnia (arquivo de rotas disponível na raiz)
- Estrutura em camadas: Controllers, UseCases, Repositories, Validators, DTOs, Services e Middlewares

## Estrutura do Projeto:

- Controllers: recebem as requisições e chamam UseCases e Repositories.
- UseCases: contêm a lógica de negócio.
- Repositories: fazem acesso ao banco usando Models.
- Models: representam tabelas do banco, com regras simples (ex: hash de senha).
- Validators: validam os dados recebidos na requisição.
- DTOs: transportam dados validados entre camadas.
- Middlewares: autenticação/autorização.
- Services: integrações externas (ex: Stripe, Asaas).
- Utils: funções auxiliares e constantes globais.

## Regras Arquiteturais:

- Apenas Repositories e Middlewares acessam diretamente as Models.
- UseCases e Repositories são serviços que podem ser chamados pelos Controllers.
- Validators e DTOs devem transportar apenas os dados necessários.
- Middlewares devem ser usados com parcimônia nas rotas.

## Convenções de Código:

- Arquivos: `snake_case`
- Classes: `CamelCase` (com inicial maiúscula)
- Métodos e Funções: `camelCase` iniciando com verbo
- Variáveis: `camelCase`
- Tabelas SQL: `snake_case`, minúsculas e plural
- Colunas SQL: `snake_case`, minúsculas e singular
- Arrays: nomeados no plural

## Outras Observações:

- O projeto usa um arquivo `.env` baseado no `.env.example`.
- O banco de dados é inicializado via Docker Compose.
- Evite valores mágicos; prefira constantes.
- O código deve ser limpo, bem organizado e flexível quando necessário.
