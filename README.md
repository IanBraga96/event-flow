# 📅 Plataforma de Gestão de Eventos

Uma plataforma completa para gerenciamento de eventos presenciais e online. A aplicação permite que organizadores criem eventos e que participantes se inscrevam neles, garantindo a
integridade das inscrições e a segurança dos dados.

## 🎯 Objetivo

Desenvolver uma solução robusta para gestão de eventos com autenticação segura e controle de participantes, permitindo organizar e participar de eventos de forma prática e segura.

## 📦 Estrutura do Projeto

Este repositório contém duas aplicações principais:

### **Backend - Event Flow API** (`event-flow-api/`)

- Framework: **AdonisJS** (Node.js)
- Responsável pelas operações de negócio, autenticação e gerenciamento de dados
- Endpoints para gerenciamento de usuários, eventos e inscrições

### **Frontend - Event Flow Web** (`event-flow-web/`)

- Framework: **React**
- Interface para usuarios se autenticarem e gerenciarem seus eventos e inscrições

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker e Docker Compose (opcional, para banco de dados)

### API

#### Opção 1: Usando Docker Compose (Recomendado)

```bash
cd event-flow-api

# Criar arquivo .env com as variáveis de ambiente necessárias
# (APP_NAME, DB_USER, DB_PASSWORD, DB_DATABASE)

# Iniciar o banco de dados PostgreSQL
docker-compose up -d

# Instalar dependências
npm install

# Executar migrações do banco de dados
npm run migration:latest

# Após subir o Docker e preparar o banco, executar os seeders
node ace db:seed

# Iniciar servidor (porta 3333)
npm run dev
```

#### Opção 2: Sem Docker

```bash
cd event-flow-api

# Certifique-se de ter PostgreSQL instalado e configurado

# Instalar dependências
npm install

# Executar migrações do banco de dados
npm run migration:latest

# Executar seeders (dados iniciais)
node ace db:seed

# Iniciar servidor (porta 3333)
npm run dev
```

### Web

```bash
cd event-flow-web

# Criar arquivo .env a partir do exemplo
cp .env.example .env

# Ajustar URL da API no .env (se necessário)
# REACT_APP_API_URL=http://localhost:3333

# Instalar dependências
npm install

# Iniciar aplicação (porta 3000)
npm start
```

> Antes de iniciar o frontend, certifique-se de que a API está rodando na porta configurada em `REACT_APP_API_URL`.

## ✨ Funcionalidades

### Autenticação

- Login de Organizadores e Participantes via Bearer Token

### Participante

- Cadastro e edição de dados pessoais
- Visualização de eventos inscritos
- Cancelamento de inscrições

### Organizador

- Criação e edição de eventos
- Exclusão de eventos (sem inscritos)
- Visualização de participantes inscritos

## 🔐 Regras de Negócio

- **Capacidade limitada:** Limite máximo de participantes por evento
- **Sem conflitos de horário:** Um participante não pode se inscrever em dois eventos simultaneamente
- **Unicidade:** Cada participante pode se inscrever uma única vez por evento
- **Propriedade:** Organizadores só podem modificar seus próprios eventos
- **Dados obrigatórios:** Nome, Data/Hora, Localização e Capacidade Máxima

## � Banco de Dados

Você pode visualizar o diagrama e a documentação completa do banco de dados:

🔗 [Diagrama do Banco de Dados - Eraser.io](https://app.eraser.io/workspace/a61xaBHx6spEebsKMBdn?origin=share)

O banco de dados contém as seguintes tabelas principais:

- **users** - Usuários (Participantes e Organizadores)
- **participants** - Dados específicos de Participantes
- **organizers** - Dados específicos de Organizadores
- **events** - Eventos criados por Organizadores
- **registrations** - Inscrições de Participantes em Eventos

## �👥 Contribuidores

Projeto desenvolvido como trabalho da faculdade em grupo.

## 📝 Licença

Projeto acadêmico - ADS1
