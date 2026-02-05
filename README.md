# Alcance Sol PWA

Um Progressive Web App (PWA) para reportar problemas de conectividade e sinal, com funcionamento offline e integração com WhatsApp.

## ✨ Funcionalidades

- 📱 **PWA Instalável** - Instale como app no celular
- 🔒 **Login Simulado** - Autenticação mock local
- 🗺️ **Mapa com Antenas** - Visualize cobertura de sinal
- 📝 **Reportar Problemas** - Formulário integrado com WhatsApp
- 📋 **Histórico** - Mensagens salvas localmente
- 📴 **Funciona Offline** - Navegação e salvamento sem internet

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env.local

# Editar .env.local com suas chaves
```

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Produção (para testar PWA)

```bash
npm run build
npm run start
```

> ⚠️ **PWA requer HTTPS** - Em produção, use HTTPS para o service worker funcionar.

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz:

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_api_key_aqui

# Número do WhatsApp (com código do país)
NEXT_PUBLIC_SUPPORT_WA_NUMBER=5562999991234
```

### Obtendo a API Key do Google Maps

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto ou selecione existente
3. Ative "Maps JavaScript API"
4. Crie uma credencial (API Key)
5. Restrinja a chave por HTTP referrer (recomendado)

## 📱 Testando PWA

1. Faça build de produção: `npm run build && npm start`
2. Acesse via HTTPS ou localhost
3. No Chrome DevTools > Application > Service Workers
4. Verifique se o SW está registrado
5. Teste offline:
   - Vá em Network > marque "Offline"
   - Navegue pelas telas
   - Crie mensagens e verifique histórico

## 🌐 Deploy (Vercel)

```bash
# Via CLI
npm i -g vercel
vercel

# Ou conecte o repositório no Vercel Dashboard
```

Configure as variáveis de ambiente no Vercel Dashboard.

## ⚠️ Limitações

### Google Maps Offline
O Google Maps **não funciona offline** - os tiles do mapa requerem conexão. Quando offline:
- Um placeholder informativo é exibido
- Todas as outras funcionalidades continuam funcionando
- Você pode reportar problemas e ver histórico normalmente

### Armazenamento Local
- Dados são salvos no IndexedDB do navegador
- Limpar dados do navegador remove as mensagens
- Não há sincronização entre dispositivos

## 🛠️ Stack Tecnológica

- **Next.js 15** - App Router
- **TypeScript** - Tipagem estática
- **Hero UI** - Componentes de UI
- **Tailwind CSS** - Estilização
- **IndexedDB (idb)** - Armazenamento local
- **Lucide React** - Ícones
- **Google Maps** - Mapas

## 📁 Estrutura do Projeto

```
alcance-sol/
├── app/
│   ├── (protected)/      # Rotas protegidas
│   │   ├── home/         # Mapa e antenas
│   │   ├── report/       # Formulário de report
│   │   ├── history/      # Histórico de mensagens
│   │   ├── contact/      # Contato
│   │   └── layout.tsx    # Layout com sidebar
│   ├── login/            # Página de login
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Redirect inicial
├── components/
│   ├── MapComponent.tsx  # Google Maps
│   └── Sidebar.tsx       # Menu lateral
├── lib/
│   ├── AuthContext.tsx   # Contexto de autenticação
│   ├── storage.ts        # IndexedDB helpers
│   └── types.ts          # TypeScript types
├── public/
│   ├── icons/            # Ícones PWA
│   ├── manifest.json     # PWA manifest
│   └── sw.js             # Service Worker
└── ...
```

## 📄 Licença

MIT
