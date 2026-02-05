# Sol Conectividade PWA

Um Progressive Web App (PWA) para reportar problemas de conectividade e sinal, com funcionamento offline e integração com WhatsApp.

## ✨ Funcionalidades

- 📱 **PWA Instalável** - Instale como app no celular
- 🔒 **Login Simulado** - Autenticação mock local
- 🗺️ **Mapa com Imagens de Satélite** - Visualize cobertura de sinal com imagens de satélite (ESRI)
- 📝 **Reportar Problemas** - Formulário integrado com WhatsApp
- 📋 **Histórico** - Mensagens salvas localmente
- 📴 **Funciona Offline** - Navegação e salvamento sem internet

## 🚀 Como Rodar

### Instalação

```bash
yarn install
```

### Desenvolvimento

```bash
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Produção

```bash
yarn build
yarn start
```

## 🛠️ Stack Tecnológica

- **Next.js 15** - App Router
- **TypeScript** - Tipagem estática
- **Hero UI** - Componentes de UI
- **Tailwind CSS** - Estilização
- **IndexedDB (idb)** - Armazenamento local
- **Lucide React** - Ícones
- **Leaflet** - Mapas e Visualização de Satélite
