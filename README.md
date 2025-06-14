# IA Board by Filippe™ - Curiso 1:1 Replica Completa

Sistema idêntico pixel-perfect ao projeto Curiso original, com canvas infinito ReactFlow, blocos IA interativos conectados a múltiplas APIs reais, e funções completas de exportação e CTA operacionais.

## 🚀 Características Principais

### 🧠 Múltiplas IAs Integradas
- **OpenAI GPT-4o** - Modelo mais avançado para tarefas gerais
- **Claude 3 Sonnet** - Especializado em análise e raciocínio
- **Gemini 1.5 Pro** - Google AI para tarefas específicas

### 🎨 Canvas Infinito Avançado
- Zoom e pan ilimitados
- Sistema de grid inteligente
- Nós IA totalmente funcionais
- Conexões visuais entre nós
- Histórico com undo/redo

### 📊 Templates Predefinidos
- **Funil de Marketing** - Pesquisa, copy e landing page
- **Criação de Conteúdo** - Brainstorm, artigo e adaptação
- **Estratégia de Negócio** - SWOT, crescimento e métricas

### 💾 Exportação Completa
- **JSON** - Dados estruturados do projeto
- **Markdown** - Documentação legível
- **PDF** - Relatório profissional

## 🛠️ Instalação e Configuração

### 1. Dependências
```bash
npm install
# ou
bun install
```

### 2. Configuração do Ambiente
Copie o arquivo `.env.example` para `.env` e configure suas chaves:

```bash
cp .env.example .env
```

Configure as chaves de API no arquivo `.env`:
```env
OPENAI_API_KEY=sk-CHAVE_REAL_AQUI
ANTHROPIC_API_KEY=sk-ant-CHAVE_REAL_AQUI
GOOGLE_API_KEY=AIzaCHAVE_REAL_AQUI
```

### 3. Execução Local
```bash
npm run dev
# ou
bun run dev
```

A aplicação estará disponível em `http://localhost:5000`

## 📋 Funcionalidades Implementadas

### ✅ Canvas Interativo
- [x] Canvas infinito com zoom e pan
- [x] Sistema de grid configurável
- [x] Nós AI arrastáveis e redimensionáveis
- [x] Conexões visuais entre nós
- [x] Seleção múltipla de nós

### ✅ Integração de IA
- [x] Conexão real com OpenAI GPT-4o
- [x] Integração com Claude 3 Sonnet
- [x] Suporte para Gemini 1.5 Pro
- [x] Configuração de parâmetros por nó
- [x] Execução em tempo real

### ✅ Sistema de Templates
- [x] Templates predefinidos
- [x] Carregamento automático de nós
- [x] Configuração personalizada
- [x] Workflow inteligente

### ✅ Exportação Avançada
- [x] Exportação JSON completa
- [x] Geração de Markdown
- [x] Criação de PDF profissional
- [x] Estatísticas do projeto

### ✅ Interface Moderna
- [x] Design responsivo
- [x] Tema escuro com gradientes
- [x] Animações suaves
- [x] Tooltips contextuais
- [x] Feedback visual

## 🎯 Como Usar

### 1. Acesso ao Sistema
- **IA Board Clássico** (`/board`) - Interface tradicional
- **IA Board Supremo** (`/advanced-board`) - Canvas avançado

### 2. Criando Nós IA
1. Clique em "Nó IA" na barra de ferramentas
2. Configure o modelo de IA desejado
3. Digite seu prompt
4. Clique em "Executar" para obter resposta

### 3. Usando Templates
1. Clique em "Templates" na barra de ferramentas
2. Escolha um template predefinido
3. O sistema carregará os nós automaticamente
4. Execute cada nó conforme necessário

### 4. Exportando Projetos
1. Clique em "Exportar" no canto superior direito
2. Escolha o formato desejado (JSON, MD, PDF)
3. O arquivo será baixado automaticamente

## 🏗️ Arquitetura Técnica

### Frontend
- **React + TypeScript** - Interface moderna
- **Tailwind CSS** - Estilização responsiva
- **Framer Motion** - Animações suaves
- **Wouter** - Roteamento leve
- **TanStack Query** - Gerenciamento de estado

### Backend
- **Node.js + Express** - Servidor robusto
- **PostgreSQL** - Banco de dados
- **Drizzle ORM** - Mapeamento objeto-relacional
- **OpenAI SDK** - Integração com GPT-4o
- **Anthropic SDK** - Integração com Claude

### Recursos Avançados
- **Canvas Infinito** - Viewport escalável
- **Sistema de Conexões** - Fluxo visual de dados
- **Templates Inteligentes** - Workflows predefinidos
- **Exportação Multi-formato** - JSON, MD, PDF

## 🔧 Configurações Avançadas

### Parâmetros de IA
- **Temperature** - Controla criatividade (0-2)
- **Max Tokens** - Limite de resposta (1-4000)
- **System Prompt** - Instruções específicas

### Canvas
- **Grid** - Sistema de alinhamento
- **Zoom** - Escala de 10% a 300%
- **Pan** - Navegação livre
- **Snap** - Alinhamento automático

## 📱 Versão Desktop

Baixe a versão desktop completa:
[IA Board Desktop (.exe)](https://github.com/FeehMatheus/ia-board/releases)

### Características Desktop
- Execução offline
- Performance otimizada
- Integração com sistema
- Atualizações automáticas

## 🎨 Identidade Visual

### Cores Principais
- **Primária**: Gradiente violeta/roxo (`#8b5cf6` → `#a855f7`)
- **Secundária**: Gradiente ciano/azul (`#06b6d4` → `#3b82f6`)
- **Destaque**: Neon ciano (`#00d9ff`)

### Tipografia
- **Títulos**: Inter Bold
- **Texto**: Inter Regular
- **Código**: JetBrains Mono

## 🔐 Segurança

- Chaves de API armazenadas no servidor
- Validação de entrada rigorosa
- Rate limiting implementado
- Sanitização de dados

## 📊 Performance

- Renderização otimizada do canvas
- Lazy loading de componentes
- Cache inteligente de requisições
- Compressão de assets

## 🚀 Deploy

### Replit (Recomendado)
1. Faça fork do projeto
2. Configure as variáveis de ambiente
3. Execute `npm run dev`

### Docker
```bash
docker build -t ia-board .
docker run -p 5000:5000 ia-board
```

### Vercel/Netlify
Configure as variáveis de ambiente e faça deploy direto do repositório.

## 📞 Suporte

- **Email**: suporte@iaboard.filippe.com
- **Documentação**: [docs.iaboard.filippe.com](https://docs.iaboard.filippe.com)
- **Comunidade**: [discord.gg/iaboard](https://discord.gg/iaboard)

## 📄 Licença

© 2025 IA Board by Filippe™. Todos os direitos reservados.

---

**Desenvolvido com 💜 pela equipe IA Board by Filippe™**