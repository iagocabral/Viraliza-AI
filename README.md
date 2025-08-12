# Viraliza.ai

Sistema para geração de conteúdo viral para redes sociais usando inteligência artificial.

## 🚀 Tecnologias

- **Frontend**: Next.js 15 com App Router
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Pagamentos**: Stripe
- **IA**: OpenAI GPT-4
- **Deploy**: Vercel

## 📋 Funcionalidades

### MVP (Fase 1)
- ✅ Autenticação (Email/Senha + Google)
- ✅ Landing Page responsiva
- ✅ Dashboard interativo
- ✅ Gerador de ideias de conteúdo
- ✅ Criador de legendas
- ✅ Sistema de assinaturas (Free/Pro)
- ✅ Controle de limite de gerações
- ✅ Integração com Stripe para pagamentos

### Fase 2 (Futuro)
- [ ] Gerador de hashtags
- [ ] Criador de roteiros para vídeos
- [ ] Histórico de gerações
- [ ] Analytics de conteúdo

## 🛠️ Setup do Projeto

### 1. Pré-requisitos
- Node.js 18+
- Conta no Supabase
- Conta na OpenAI
- Conta no Stripe
- Conta no Vercel (para deploy)

### 2. Configuração Local

```bash
# Clone o repositório
git clone <repository-url>
cd viraliza-ai

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
```

### 3. Configuração do Supabase

1. Crie um novo projeto no [Supabase](https://supabase.com)
2. Vá para Settings > API e copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Execute o script SQL do arquivo `database.sql` no SQL Editor do Supabase
4. Configure o Google OAuth (opcional):
   - Vá para Authentication > Providers
   - Ative o Google provider
   - Configure as credenciais OAuth

### 4. Configuração da OpenAI

1. Acesse [OpenAI Platform](https://platform.openai.com)
2. Crie uma API key
3. Adicione ao `.env.local`: `OPENAI_API_KEY=sua_chave_aqui`

### 5. Configuração do Stripe

1. Crie uma conta no [Stripe](https://stripe.com)
2. Vá para Developers > API keys e copie:
   - Secret key → `STRIPE_SECRET_KEY`
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Configure um produto de assinatura:
   - Crie um produto "Viraliza.ai Pro"
   - Adicione um preço recorrente mensal
   - Copie o Price ID para usar no código
4. Configure webhooks:
   - URL: `https://seu-dominio.com/api/webhooks/stripe`
   - Eventos: `checkout.session.completed`, `customer.subscription.deleted`
   - Copie o webhook secret → `STRIPE_WEBHOOK_SECRET`

### 6. Executar Localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### 7. Deploy na Vercel

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente na Vercel
3. Deploy automático será configurado

## 📱 Uso

### Plano Gratuito
- 10 gerações por mês
- Gerador de ideias
- Criador de legendas

### Plano Pro (R$ 29/mês)
- Gerações ilimitadas
- Todas as ferramentas
- Suporte prioritário

## 🔒 Segurança

- Todas as chaves de API ficam no servidor
- RLS (Row Level Security) no Supabase
- Autenticação robusta
- Validação de dados em todas as APIs

## 📄 Licença

Este projeto é privado e proprietário.

## 🤝 Suporte

Para dúvidas ou suporte, entre em contato através do email.
