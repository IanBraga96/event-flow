# 📋 Tarefas de Desenvolvimento - Event Flow

## 🔐 Autenticação (Compartilhado)

### Backend

- [✅] **RF01-BE:** Implementar endpoint de login (POST `/auth/login`)
  - [✅] Validar credenciais de Organizadores
  - [✅] Validar credenciais de Participantes
  - [✅] Gerar Bearer Token JWT
  - [✅] Retornar token com dados do usuário

- [✅] **RF01-BE:** Implementar middleware de autenticação
  - [✅] Validar Bearer Token em requisições protegidas
  - [✅] Retornar erro 401 se token inválido

### Frontend

- [ ] **RF01-FE:** Criar página de Login
  - [ ] Campo de email/usuário
  - [ ] Campo de senha
  - [ ] Botão de login com feedback
  - [ ] Tratamento de erros
  - [ ] Redirecionamento após login bem-sucedido
  - [ ] Armazenamento seguro do token (localStorage/sessionStorage)

---

## 👤 Módulo: Participante

### Backend

- [✅] **RF02-BE:** Implementar registro de novo participante (POST `/auth/register` com `type: "participant"`)
  - [✅] Validar campos: Nome, E-mail, CPF, Senha
  - [✅] Validar email único
  - [✅] Validar CPF único
  - [✅] Hash de senha
  - [✅] Retornar usuário + token

- [✅] **RF03-BE:** Implementar edição de dados do participante (PUT `/participants/:id`)
  - [✅] Validar autenticação via Bearer Token
  - [✅] Validar que o `:id` pertence ao usuário autenticado
  - [✅] Permitir editar: Nome, E-mail
  - [✅] Validar CPF imutável (não aceito no body)
  - [✅] Validar email único (excluindo o atual)

- [ ] **RF04-BE:** Listar eventos inscritos do participante (GET `/participants/:id/events`)
  - [ ] Validar autenticação
  - [ ] Retornar apenas eventos do participante logado
  - [ ] Incluir dados do evento e status da inscrição

- [ ] **RF05-BE:** Cancelar inscrição em evento (DELETE `/registrations/:id`)
  - [ ] Validar autenticação
  - [ ] Validar propriedade da inscrição
  - [ ] Remover inscrição do banco
  - [ ] Atualizar contagem de participantes

### Frontend

- [ ] **RF02-FE:** Criar página de Cadastro de Participante
  - [ ] Formulário com Nome, E-mail, CPF, Senha
  - [ ] Validações de entrada
  - [ ] Enviar para API
  - [ ] Feedback de sucesso/erro
  - [ ] Redirecionamento para login

- [ ] **RF03-FE:** Criar página de Edição de Perfil
  - [ ] Carregar dados atuais do participante
  - [ ] Formulário editável (Nome, E-mail)
  - [ ] Botão de salvar com feedback
  - [ ] Tratamento de erros

- [ ] **RF04-FE:** Criar página de Meus Eventos (Participante)
  - [ ] Listar eventos inscritos
  - [ ] Exibir: Nome, Data, Hora, Localização, Capacidade
  - [ ] Botão para ver detalhes do evento
  - [ ] Botão para cancelar inscrição com confirmação

- [ ] **RF05-FE:** Implementar cancelamento de inscrição
  - [ ] Modal de confirmação
  - [ ] Requisição de DELETE para API
  - [ ] Atualizar lista de eventos após sucesso

---

## 🎤 Módulo: Organizador

### Backend

- [✅] **RF06-BE:** Implementar registro de novo organizador (POST `/auth/register` com `type: "organizer"`)
  - [✅] Mesma rota unificada de RF02-BE
  - [✅] CPF não obrigatório para organizadores

- [✅] **RF06B-BE:** Implementar edição de dados do organizador (PUT `/organizers/:id`)
  - [✅] Validar autenticação via Bearer Token
  - [✅] Validar que o `:id` pertence ao usuário autenticado
  - [✅] Permitir editar: Nome, E-mail
  - [✅] Validar email único (excluindo o atual)

- [ ] **RF07-BE:** Criar novo evento (POST `/events`)
  - [ ] Validar autenticação como organizador
  - [ ] Validar campos: Nome, Data/Hora, Localização, Capacidade
  - [ ] Associar evento ao organizador logado
  - [ ] Salvar no banco de dados

- [ ] **RF08-BE:** Editar evento (PUT `/events/:id`)
  - [ ] Validar autenticação
  - [ ] Validar propriedade do evento (RN04)
  - [ ] Permitir editar: Nome, Data/Hora, Localização, Capacidade
  - [ ] Salvar mudanças

- [ ] **RF09-BE:** Deletar evento (DELETE `/events/:id`)
  - [ ] Validar autenticação
  - [ ] Validar propriedade do evento (RN04)
  - [ ] Verificar se há inscritos
  - [ ] Retornar erro 409 se houver inscritos
  - [ ] Deletar se vazio

- [ ] **RF10-BE:** Listar participantes do evento (GET `/events/:id/participants`)
  - [ ] Validar autenticação
  - [ ] Validar propriedade do evento
  - [ ] Retornar lista com: Nome, E-mail, Data de inscrição

### Frontend

- [ ] **RF06-FE:** Criar página de Cadastro de Organizador
  - [ ] Formulário com Nome, E-mail, Senha
  - [ ] Validações de entrada
  - [ ] Enviar para API
  - [ ] Feedback de sucesso/erro
  - [ ] Redirecionamento para login

- [ ] **RF07-FE:** Criar página de Criar Evento
  - [ ] Formulário com: Nome, Data, Hora, Localização, Capacidade
  - [ ] Validações de entrada
  - [ ] Picker de data/hora
  - [ ] Botão de criar com feedback
  - [ ] Redirecionamento após sucesso

- [ ] **RF08-FE:** Criar página de Editar Evento
  - [ ] Carregar dados do evento
  - [ ] Formulário editável
  - [ ] Validações
  - [ ] Botão de salvar com feedback
  - [ ] Tratamento de erros (RN04)

- [ ] **RF09-FE:** Implementar exclusão de evento
  - [ ] Botão de deletar com confirmação
  - [ ] Mostrar aviso se houver inscritos
  - [ ] Requisição de DELETE para API
  - [ ] Redirecionar se sucesso

- [ ] **RF10-FE:** Criar página de Participantes do Evento
  - [ ] Listar inscritos no evento
  - [ ] Exibir: Nome, E-mail, Data de inscrição
  - [ ] Opção de exportar lista (opcional)

---

## 📅 Módulo: Eventos (Compartilhado)

### Backend

- [ ] **RN01-BE:** Implementar validação de capacidade
  - [ ] Validar limite máximo na inscrição
  - [ ] Retornar erro 409 se cheio

- [ ] **RN02-BE:** Implementar validação de conflito de horário
  - [ ] Na inscrição, verificar se participante está inscrito em outro evento no mesmo horário
  - [ ] Retornar erro 409 se houver conflito

- [ ] **RN03-BE:** Implementar validação de unicidade de inscrição
  - [ ] Na inscrição, verificar se já está inscrito
  - [ ] Retornar erro 409 se já existe

- [ ] **RN05-BE:** Validar dados obrigatórios do evento
  - [ ] Nome, Data/Hora, Localização, Capacidade Máxima

- [ ] Criar endpoint de listagem geral de eventos (GET `/events`)
  - [ ] Listar todos os eventos disponíveis
  - [ ] Incluir filtros: data, localização, capacidade disponível

- [ ] Criar endpoint de inscrição em evento (POST `/events/:id/register`)
  - [ ] Validar autenticação
  - [ ] Aplicar todas as regras de negócio (RN01-RN03)
  - [ ] Criar registro de inscrição
  - [ ] Atualizar contagem de participantes

### Frontend

- [ ] **Geral-FE:** Criar página de Explorar Eventos
  - [ ] Listar todos os eventos disponíveis
  - [ ] Exibir: Nome, Data, Hora, Localização, Capacidade (disponível/máx)
  - [ ] Filtros: Data, Localização
  - [ ] Botão para ver detalhes
  - [ ] Botão para se inscrever (com validações)

- [ ] **Geral-FE:** Criar página de Detalhes do Evento
  - [ ] Exibir todas as informações do evento
  - [ ] Descrição (se houver)
  - [ ] Organizador
  - [ ] Número de inscritos
  - [ ] Botão de inscrever ou "Já inscrito"
  - [ ] Tratamento de erros (RN01-RN03)

---

## 🏗️ Banco de Dados

- [✅] **BE:** Criar tabela `users`
  - [✅] id, type (participant/organizer), email, password_hash, name, cpf (nullable), created_at, updated_at

- [✅] **BE:** Criar tabela `events`
  - [✅] id, user_id, name, description, date_time, location, capacity, created_at, updated_at

- [✅] **BE:** Criar tabela `registrations`
  - [✅] id, user_id, event_id, created_at

- [✅] **BE:** Criar índices para performance
  - [✅] Índice em `users.email`
  - [✅] Índice em `users.cpf`
  - [✅] Índice em `events.user_id`
  - [✅] Índice em `registrations.user_id`
  - [✅] Índice em `registrations.event_id`

---

## 🎨 Layout & UX

- [ ] Barra de navegação com menu
  - [ ] Links distintos para Participante/Organizador
  - [ ] Link para Perfil
  - [ ] Botão de Logout

- [ ] Página inicial/dashboard
  - [ ] Diferentes views para Participante e Organizador

- [ ] Responsividade
  - [ ] Testes em mobile, tablet, desktop

- [ ] Feedback visual
  - [ ] Loading spinners
  - [ ] Toast/alert mensagens
  - [ ] Confirmação de ações destrutivas

---

## 📚 Documentação

- [ ] [ ] Documentação da API (Swagger/OpenAPI)
- [ ] README do projeto
- [ ] Instruções de setup e deploy

---

## 🚀 Status Geral

| Módulo         | Backend | Frontend | Status  |
| -------------- | ------- | -------- | ------- |
| Autenticação   | ⬜      | ⬜       | A fazer |
| Participante   | ⬜      | ⬜       | A fazer |
| Organizador    | ⬜      | ⬜       | A fazer |
| Eventos        | ⬜      | ⬜       | A fazer |
| Banco de Dados | ⬜      | -        | A fazer |
| Design/UX      | -       | ⬜       | A fazer |

---

**Legenda:**

- ⬜ = Não iniciado
- 🟨 = Em progresso
- ✅ = Concluído
