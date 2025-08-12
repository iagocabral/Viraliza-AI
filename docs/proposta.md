# Blueprint de Execução: Viraliza.ai
**Versão:** 2.0
**Data:** 2025-08-12
**Objetivo:** BluePrint de um aplicativo SaaS full-stack, desde a configuração do ambiente até o deploy do MVP.

---

## 1. META_OBJECTIVE

Construir e implantar a Fase 1 (MVP) de um aplicativo SaaS chamado **Viraliza.ai**. O aplicativo deve permitir que usuários se cadastrem, gerem ideias de conteúdo e legendas para redes sociais usando uma API de LLM, e façam upgrade para um plano pago através de uma assinatura.

---

## 2. CORE_PRINCIPLES

Princípios arquiteturais e de design durante todo o desenvolvimento:

-   **SERVERLESS_FIRST:** Priorizar o uso de funções serverless para o backend para garantir escalabilidade e custo-efetividade.
-   **MODULAR_DESIGN:** A arquitetura deve ser desacoplada (Frontend/Backend) e baseada em componentes/nano-serviços para facilitar a manutenção e futuras expansões.
-   **COST_EFFECTIVE:** Utilizar serviços com planos gratuitos generosos para o MVP, minimizando o custo fixo inicial.
-   **MOBILE_FIRST_UI:** A interface do usuário deve ser projetada e implementada com foco principal em dispositivos móveis.
-   **SECURITY:** Proteger todas as chaves de API, dados de usuário e garantir a conformidade com a LGPD. O código do lado do cliente NUNCA deve conter chaves secretas.

---

## 3. STACK_DEFINITION

Utilizar exclusivamente a seguinte stack tecnológica:

-   **Framework Frontend:** `Next.js` (com App Router)
-   **Framework CSS:** `Tailwind CSS` (versão estável `v3.4+`)
-   **Biblioteca de Componentes:** `shadcn/ui`
-   **Plataforma de Deploy:** `Vercel`
-   **Banco de Dados e Autenticação:** `Supabase`
-   **Provedor de LLM:** `OpenAI` (API do GPT-4o ou superior)
-   **Gateway de Pagamento:** `Stripe` (API de Subscriptions e Checkout)
-   **Linguagem:** `TypeScript`

---

## 4. EXECUTION_PLAN

Executar as seguintes tarefas na ordem especificada pelas dependências.

### FASE 0: Configuração do Ambiente e Serviços

| ID da Tarefa | Descrição da Ação | Entradas (Inputs) | Saídas (Outputs) | Tecnologias / Módulos | Dependências |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T0.1** | Inicializar o projeto Next.js com TypeScript e Tailwind CSS. | Nome do projeto: `viraliza-ai`. | Estrutura de diretórios do projeto criada. | `npx create-next-app@latest` | N/A |
| **T0.2** | Criar um repositório no GitHub e conectar ao projeto local. | Código do T0.1. | Repositório no GitHub com o código inicial. | `git`, GitHub | T0.1 |
| **T0.3** | Criar e configurar o projeto na Vercel, linkando ao repositório GitHub. | Acesso ao repositório GitHub. | Pipeline de CI/CD ativo para deploys automáticos. | Vercel | T0.2 |
| **T0.4** | Criar e configurar o projeto no Supabase. | Nome do projeto, região. | URL do projeto, `SUPABASE_URL`, `SUPABASE_ANON_KEY`. | Supabase | N/A |
| **T0.5** | Obter chaves de API da OpenAI. | Conta OpenAI. | `OPENAI_API_KEY`. | OpenAI Platform | N/A |
| **T0.6** | Criar conta de desenvolvedor no Stripe. | Dados cadastrais. | `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`. | Stripe Dashboard | N/A |
| **T0.7** | Configurar todas as chaves (T0.4, T0.5, T0.6) como variáveis de ambiente no projeto Vercel. | Chaves de API. | Variáveis de ambiente seguras disponíveis para a aplicação. | Vercel Environment Variables | T0.4, T0.5, T0.6 |

### FASE 1: MVP - Backend (Lógica de Negócio)

| ID da Tarefa | Descrição da Ação | Entradas (Inputs) | Saídas (Outputs) | Tecnologias / Módulos | Dependências |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T1.1** | Implementar a funcionalidade de Autenticação (Email/Senha e Google). | `SUPABASE_URL`, `SUPABASE_ANON_KEY`. | Funções `signUp`, `signInWithPassword`, `signInWithOAuth`, `signOut`. | `@supabase/supabase-js` | T0.4, T0.7 |
| **T1.2** | Criar a tabela `profiles` no Supabase com as colunas necessárias. | Schema SQL. | Tabela `profiles` com colunas: `id` (UUID, FK para `auth.users`), `email` (TEXT), `subscription_status` (ENUM: 'free', 'pro'), `generation_count` (INT). | Supabase SQL Editor | T1.1 |
| **T1.3** | Criar a API Route `/api/generate/idea`. | `userId`, `niche`. | Resposta JSON com array de ideias de conteúdo. | Next.js API Routes, OpenAI API | T0.5, T1.2 |
| **T1.4** | Criar a API Route `/api/generate/caption`. | `userId`, `description`, `tone`. | Resposta JSON com array de legendas. | Next.js API Routes, OpenAI API | T0.5, T1.2 |
| **T1.5** | Implementar a lógica de controle de uso e contagem de gerações. | `userId` da requisição. | Interromper a requisição se `generation_count` >= 10 E `subscription_status` == 'free'. Incrementar `generation_count` a cada chamada bem-sucedida. | Supabase DB Query, Next.js API Routes | T1.2, T1.3, T1.4 |
| **T1.6** | Criar a API Route `/api/checkout/create-session` para iniciar o pagamento. | `userId`, `price_id` do Stripe. | URL de checkout do Stripe. | Stripe API, Next.js API Routes | T0.6, T1.2 |
| **T1.7** | Criar a API Route `/api/webhooks/stripe` para receber eventos de pagamento. | Payload do webhook do Stripe. | Atualização do `subscription_status` do usuário na tabela `profiles` para 'pro'. | Stripe Webhooks, Supabase DB Query | T0.6, T1.2 |

### FASE 1: MVP - Frontend (Interface do Usuário)

| ID da Tarefa | Descrição da Ação | Entradas (Inputs) | Saídas (Outputs) | Tecnologias / Módulos | Dependências |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T1.8** | Construir a Landing Page (`/`) conforme as diretrizes de design. | Textos e imagens de marketing. | Página estática pública. | Next.js Pages, Tailwind CSS, `shadcn/ui` | T0.1 |
| **T1.9** | Construir as páginas de Login (`/login`) e Cadastro (`/signup`). | Componentes `shadcn/ui`. | Formulários que interagem com as funções de autenticação do Supabase. | `shadcn/ui` (Input, Button, Card), React Hook Form | T1.1 |
| **T1.10**| Implementar proteção de rotas privadas. | Contexto de autenticação do Supabase. | Usuários não logados são redirecionados de rotas como `/dashboard` para `/login`. | Next.js Middleware, `@supabase/supabase-js` | T1.1, T1.9 |
| **T1.11**| Construir o Dashboard (`/dashboard`) com a navegação principal. | Estado de autenticação do usuário. | Interface principal da aplicação. | `shadcn/ui`, Next.js App Router | T1.9, T1.10 |
| **T1.12**| Construir a UI para as ferramentas "Gerador de Ideias" e "Criador de Legendas". | `Textarea`, `Button`, `Card` do `shadcn/ui`. | Formulários que enviam requisições para `/api/generate/*` e exibem os resultados formatados. | React (useState, useEffect) | T1.3, T1.4, T1.11 |
| **T1.13**| Construir a página de Planos e Preços (`/pricing`). | Descrição dos planos. | Botão "Assinar Agora" que chama a API `/api/checkout/create-session` e redireciona o usuário. | `shadcn/ui` | T1.6, T1.11 |

### FASE 2: Aprimoramento (Próximos Passos Pós-MVP)

| ID da Tarefa | Descrição da Ação | Entradas (Inputs) | Saídas (Outputs) | Tecnologias / Módulos | Dependências |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T2.1** | Criar a API Route `/api/generate/hashtags` e a UI correspondente. | `userId`, `topic`. | Array de hashtags. | OpenAI API, `shadcn/ui` | Fase 1 |
| **T2.2** | Criar a API Route `/api/generate/script` e a UI correspondente. | `userId`, `idea`. | Roteiro de vídeo curto. | OpenAI API, `shadcn/ui` | Fase 1 |
| **T2.3** | Implementar um dashboard para o usuário visualizar seu histórico de gerações. | `userId`. | Lista de conteúdos gerados anteriormente, salvos no Supabase. | Supabase, `shadcn/ui` | Fase 1 |