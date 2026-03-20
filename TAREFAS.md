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

- [✅] **RF01-FE:** Criar página de Login
  - [✅] Campo de email/usuário
  - [✅] Campo de senha
  - [✅] Botão de login com feedback
  - [🟨] Tratamento de erros
  - [🟨] Redirecionamento após login bem-sucedido
  - [✅] Armazenamento seguro do token (localStorage/sessionStorage)

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

- [✅] **RF04-BE:** Listar eventos inscritos do participante (GET `/participants/:id/events`)
  - [✅] Validar autenticação
  - [✅] Retornar apenas eventos do participante logado
  - [✅] Incluir dados do evento e status da inscrição

- [ ] **RF05-BE:** Cancelar inscrição em evento (DELETE `/registrations/:id`)
  - [ ] Validar autenticação
  - [ ] Validar propriedade da inscrição
  - [ ] Remover inscrição do banco
  - [ ] Atualizar contagem de participantes

### Frontend

- [✅] **RF02-FE:** Criar página de Cadastro de Participante
  - [✅] Formulário com Nome, E-mail, CPF, Senha
  - [✅] Validações de entrada
  - [✅] Enviar para API
  - [✅] Feedback de sucesso/erro

- [✅] **RF03-FE:** Criar página de Edição de Perfil
  - [🟨] Carregar dados atuais do participante (mock até login real ser integrado)
  - [✅] Formulário editável (Nome, E-mail)
  - [✅] Botão de salvar com feedback
  - [✅] Tratamento de erros
  - [✅] Página de perfil do organizador criada (`/organizer/profile`)

- [✅] **RF04-FE:** Criar página de Meus Eventos (Participante)
  - [✅] Listar eventos inscritos via GET `/participants/:id/events`
  - [✅] Exibir: Nome, Data, Hora, Localização, Capacidade
  - [✅] Filtros: Todos, Próximos, Ao vivo, Finalizados
  - [✅] Botão para ver detalhes do evento
  - [✅] Botão para cancelar inscrição com confirmação

- [🟨] **RF05-FE:** Implementar cancelamento de inscrição
  - [✅] Modal de confirmação
  - [🟨] Requisição de DELETE para API (aguardando RF05-BE)
  - [🟨] Atualizar lista de eventos após sucesso

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

- [✅] **RF07-BE:** Criar novo evento (POST `/events`)
  - [✅] Validar autenticação como organizador
  - [✅] Validar campos: Nome, Data/Hora, Localização, Capacidade
  - [✅] Associar evento ao organizador logado
  - [✅] Salvar no banco de dados

- [✅] **RF08-BE:** Editar evento (PUT `/events/:id`)
  - [✅] Validar autenticação
  - [✅] Validar propriedade do evento (RN04)
  - [✅] Permitir editar: Nome, Data/Hora, Localização, Capacidade
  - [✅] Salvar mudanças

- [✅] **RF09-BE:** Deletar evento (DELETE `/events/:id`)
  - [✅] Validar autenticação
  - [✅] Validar propriedade do evento (RN04)
  - [✅] Verificar se há inscritos
  - [✅] Retornar erro 409 se houver inscritos
  - [✅] Deletar se vazio

- [✅] **RF10-BE:** Listar participantes do evento (GET `/events/:id/participants`)
  - [✅] Validar autenticação
  - [✅] Validar propriedade do evento
  - [✅] Retornar lista com: Nome, E-mail, Data de inscrição

### Frontend

- [✅] **RF06-FE:** Criar página de Cadastro de Organizador
  - [✅] Formulário com Nome, E-mail, Senha
  - [✅] Validações de entrada
  - [✅] Enviar para API
  - [✅] Feedback de sucesso/erro

- [✅] **RF07-FE:** Criar página de Criar Evento
  - [✅] Formulário com: Nome, Data, Hora, Localização, Capacidade
  - [✅] Validações de entrada
  - [✅] Picker de data/hora
  - [✅] Botão de criar com feedback
  - [✅] Redirecionamento após sucesso

- [✅] **RF08-FE:** Criar página de Editar Evento
  - [✅] Carregar dados do evento
  - [✅] Formulário editável
  - [✅] Validações
  - [✅] Botão de salvar com feedback
  - [✅] Tratamento de erros (RN04)

- [✅] **RF09-FE:** Implementar exclusão de evento
  - [✅] Botão de deletar com confirmação
  - [✅] Mostrar aviso se houver inscritos
  - [✅] Requisição de DELETE para API
  - [✅] Redirecionar se sucesso

- [🟨] **RF10-FE:** Criar página de Participantes do Evento
  - [🟨] Botão "Ver participantes" na página de detalhes (aguardando endpoint)
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

- [✅] Criar endpoint de listagem geral de eventos (GET `/events`)
  - [✅] Listar todos os eventos disponíveis

- [ ] Criar endpoint de inscrição em evento (POST `/events/:id/register`)
  - [ ] Validar autenticação
  - [ ] Aplicar todas as regras de negócio (RN01-RN03)
  - [ ] Criar registro de inscrição
  - [ ] Atualizar contagem de participantes

### Frontend

- [✅] **Geral-FE:** Criar página de Explorar Eventos
  - [✅] Listar todos os eventos disponíveis
  - [✅] Exibir: Nome, Data, Hora, Localização, Capacidade (disponível/máx)
  - [✅] Filtros: Todos, Próximos, Ao vivo, Finalizados
  - [✅] Hero com carrossel automático de imagens
  - [✅] Botão para ver detalhes
  - [🟨] Botão para se inscrever (aguardando endpoint)

- [✅] **Geral-FE:** Criar página de Detalhes do Evento
  - [✅] Exibir todas as informações do evento
  - [✅] Descrição (se houver)
  - [✅] Organizador
  - [✅] Contador regressivo (dias, horas, minutos, segundos)
  - [✅] Botão de inscrever (visual — aguardando endpoint)
  - [✅] Botões editar/excluir para organizador criador
  - [🟨] Tratamento de erros (RN01-RN03) — aguardando endpoint

---

## 🏗️ Banco de Dados

- [✅] **BE:** Criar tabela `users`
- [✅] **BE:** Criar tabela `events`
- [✅] **BE:** Criar tabela `registrations`
- [✅] **BE:** Criar índices para performance
---

## 🎨 Layout & UX

### Landing Page

- [✅] **Landing-FE:** Criar página inicial (Landing Page)
  - [✅] Navbar com logo, links de navegação e botões de Login/Cadastro
  - [✅] Link "Início" na navbar para usuários logados (redireciona para dashboard correto)
  - [✅] Seção Hero com carrossel de 3 slides e CTAs
  - [✅] Cards da Hero clicáveis → detalhes do evento
  - [✅] Seção Marquee (faixa animada com categorias de eventos)
  - [✅] Seção UserTypes (cards para Participante e Organizador)
  - [✅] Seção Features (diferenciais da plataforma)
  - [✅] Seção HowItWorks (passo a passo de uso)
  - [✅] Seção EventsHighlight com botão "Ver todos os eventos"
  - [✅] Cards do EventsHighlight clicáveis → detalhes do evento
  - [✅] Card "Como funciona" clicável → `/how-it-works`
  - [✅] Card "Criar evento" clicável → `/events/create`
  - [✅] Seção Instagram (feed decorativo)
  - [✅] Seção CTA final com chamada para cadastro
  - [✅] Footer com links e redes sociais
  - [✅] Favicon personalizado (calendário teal + curvas amber)
  - [✅] `index.html` com lang pt-BR, theme-color e meta descrição
  - [✅] `manifest.json` atualizado com nome e ícones do EventFlow
  - [✅] CSS Modules, imagens locais em `src/assets/images/landing/`
  - [✅] Mergeada via PR #7

### Páginas Internas (AppLayout)

- [✅] **AppLayout-FE:** Layout compartilhado com sidebar e topbar fixas
  - [✅] Sidebar fixa com 3 seções (Menu, Plataforma, Conta)
  - [✅] Item "Início" com ícone de casinha no topo do menu
  - [✅] "Início" aponta para dashboard correto por tipo de usuário
  - [✅] Topbar fixa com busca e avatar
  - [✅] Menu hamburguer para mobile (drawer)
  - [✅] Navegação diferente para participante e organizador
  - [✅] Botão de logout na sidebar
  - [✅] Conteúdo rola internamente sem vazar atrás da topbar

### Páginas Secundárias

- [✅] **Páginas-FE:** Como funciona, Sobre nós, Contato
  - [✅] Hero com imagem responsiva por breakpoint
  - [✅] Guia diferente para participante e organizador (Como funciona)
  - [✅] Time com 5 membros (Sobre nós)
  - [✅] Conteúdo fixo sem rolagem desnecessária

### Página de Perfil

- [✅] **Perfil-FE:** Criar página de Perfil do Usuário
  - [✅] Navbar sticky com logo, links, avatar, nome e botão de logout
  - [✅] Link "Início" na navbar → dashboard correto
  - [✅] Logout corrigido com redirecionamento
  - [✅] Banner CTA com carrossel automático das imagens da Hero (hero1/hero2/hero3)
  - [✅] Banner do perfil com glow teal/amber e grid decorativo
  - [✅] Avatar com anel animado + botão de trocar foto (upload local)
  - [✅] Preview dinâmica: nome, ocupação, localização atualizam em tempo real
  - [✅] Badge de tipo (Participante teal / Organizador amber)
  - [✅] Stats: total de eventos, finalizados, próximos
  - [✅] Seção Informações Básicas (Nome, E-mail, Ocupação, CPF somente leitura, Tipo)
  - [✅] Seção Sobre Mim (Bio com contador de caracteres)
  - [✅] Seção Contato e Localização (Telefone, Cidade, Estado)
  - [✅] Seção Redes Sociais (LinkedIn, Instagram)
  - [✅] Botão Salvar com spinner de loading e feedback de sucesso/erro
  - [✅] Integração com API: PUT `/participants/:id` e PUT `/organizers/:id`
  - [🟨] Seção Participações Recentes (mockada — integrar com RF04-BE)
  - [🟨] Dados extras (bio, ocupação, telefone, redes) salvos localmente — aguardando campos no backend
  - [🟨] Mock de usuário ativo — remover quando login real estiver integrado

### Criar Evento

- [✅] Link "Início" na navbar → `/organizer/dashboard`
- [✅] Logout corrigido com redirecionamento
- [✅] Link da logo corrigido (`/Event` → `/`)

### Meus Eventos

- [✅] **MyEvents-FE:** Meus Eventos do Organizador (`/organizer/events`)
  - [✅] Migrado para AppLayout
  - [✅] Lista de eventos com edição e exclusão
  - [✅] Empty state melhorado
  - [✅] Seção "Eventos que você pode gostar" com 4 cards

- [✅] **MyEvents-FE:** Meus Eventos do Participante (`/participant/events`)
  - [✅] Lista de inscrições via API
  - [✅] Filtros: Todos, Próximos, Ao vivo, Finalizados
  - [✅] Botão ver detalhes
  - [✅] Botão cancelar inscrição com modal (aguardando RF05-BE)
  - [✅] Empty state com link para explorar eventos

### Geral

- [✅] Barra de navegação com menu
  - [✅] Implementada na página de Perfil
  - [✅] Implementada em Criar Evento
  - [✅] Links distintos para Participante/Organizador
  - [✅] Avatar + nome do usuário
  - [✅] Botão de Logout com redirecionamento correto

- [✅] Página inicial/dashboard
  - [✅] Dashboard do Participante (`/participant/dashboard`)
    - [✅] Saudação personalizada com horário
    - [✅] 4 cards de stats (total, próximos, finalizados, ao vivo)
    - [✅] Próximo evento em destaque com contador regressivo
    - [✅] Lista dos próximos eventos
    - [✅] Gráfico de rosca com proporção das inscrições
    - [✅] Mini calendário com dias marcados
    - [✅] Seção "Descubra novos eventos" com cards no padrão EventsHighlight
  - [✅] Dashboard do Organizador (`/organizer/dashboard`)
    - [✅] Saudação personalizada com tema âmbar
    - [✅] 4 cards de stats (total, ativos, finalizados, ao vivo)
    - [✅] Próximo evento em destaque com contador regressivo
    - [✅] Lista dos eventos recentes com botão "Gerenciar todos"
    - [✅] Gráfico de rosca com proporção dos eventos
    - [✅] Mini calendário com dias dos eventos marcados
    - [✅] Seção "Outros eventos na plataforma"

- [✅] Responsividade
  - [✅] Landing Page responsiva
  - [✅] Página de Perfil responsiva (mobile/tablet/desktop)
  - [✅] Hamburguer mobile em todas as páginas internas

- [🟨] Feedback visual
  - [✅] Loading spinners (Perfil, Login, Cadastro, todas as páginas)
  - [✅] Mensagens de sucesso/erro
  - [✅] Confirmação de ações destrutivas (cancelar inscrição, deletar evento)
  - [ ] Toast/alert global reutilizável

---

## 📚 Documentação

- [ ] Documentação da API (Swagger/OpenAPI)
- [ ] README do projeto
- [ ] Instruções de setup e deploy

---

## 🚀 Status Geral

| Módulo           | Backend | Frontend | Status                |
| ---------------- | :-----: | :------: | --------------------- |
| Autenticação     |   ✅    |    🟨    | FE em progresso       |
| Participante     |   🟨    |    ✅    | BE pendente RF05      |
| Organizador      |   ✅    |    ✅    | Concluído             |
| Eventos          |   🟨    |    ✅    | BE pendente inscrição |
| Banco de Dados   |   ✅    |    -     | Concluído             |
| Landing Page     |    -    |    ✅    | Concluída             |
| Perfil           |    -    |    ✅    | Concluído             |
| AppLayout/Nav    |    -    |    ✅    | Concluído             |
| Páginas Internas |    -    |    ✅    | Concluídas            |
| Dashboards       |    -    |    ✅    | Concluídos            |
| Design/UX Geral  |    -    |    🟨    | Em progresso          |

---

**Legenda:**

- ⬜ = Não iniciado
- 🟨 = Em progresso
- ✅ = Concluído