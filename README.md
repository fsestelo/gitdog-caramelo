# 🐶 gitdog-caramelo (Caramelo Edition)

> **Plataforma Open Source de Controle de Versão, Releases e Deploy Seguro para Workflows n8n.**

---

## 📖 Visão Geral

O **gitdog-caramelo** é uma ferramenta open source projetada para preencher a lacuna de controle de versão e governança em ecossistemas baseados no **n8n**. 

Em vez de depender de exportações manuais de JSON ou de complexas integrações Git que quebram o fluxo de trabalho ágil, o **gitdog-caramelo** utiliza um **Mecanismo de Persistência Baseado em PostgreSQL (JSONBs)**. O versionador armazena as estruturas de nós e conexões dos workflows como objetos JSONB diretamente no banco de dados relacional. Isso garante auditoria criptográfica imutável, transações seguras, suporte nativo a rollbacks e integridade transacional completa.

---

## 🎨 Design Theme: "Sophisticated Dark"

A plataforma é revestida com uma identidade visual premium e minimalista baseada no tema **Sophisticated Dark**:
* **Paleta de Cores**: Fundo ultra-escuro de alto contraste (`zinc-950`), componentes flutuantes em grafite escuro (`zinc-900`/`zinc-800`), e tipografia suave em off-white (`zinc-100`/`zinc-200`).
* **Acentos Cromáticos**: Detalhes quentes e funcionais em laranja vibrante (`orange-400`/`orange-500`), simbolizando a energia amigável do vira-lata caramelo brasileiro.
* **Tipografia**: Pairings elegantes usando **Space Grotesk** para display/títulos e **JetBrains Mono** para logs de terminal, identificadores de hash e dados de telemetria.

---

## 🌟 Funcionalidades Principais

### 1. 📊 Dashboard & Telemetria
* Visão consolidada em tempo real com contadores de workflows cadastrados, releases ativas, taxa de sucesso de deployments e tarefas pendentes.
* Monitor de status ativo de todos os clusters de infraestrutura integrados.
* Mini feed de atividades recentes de auditoria.

### 2. 🌿 Gerenciador de Workflows & Controle de Versão
* **Controle de Commits**: Registro de novas versões com hashes únicos, comentários de commit descritivos, autores e data de alteração.
* **Editor de Workflows (Mini Canvas)**: Ferramenta visual simplificada para desenhar nós (`Nodes`), conexões de fluxo de dados, reposicionar elementos e registrar commits de versão diretamente.
* **Visual Diff (Diferencial de Código)**: Comparador estrutural completo lado a lado. Identifica e destaca instantaneamente adições (`verdes`), remoções (`vermelhas`) e modificações estruturais em formato JSON amigável entre quaisquer duas versões de um fluxo.

### 3. 📦 Releases (Empacotamento Estável)
* Agrupamento e envelopamento estruturado de múltiplos workflows versionados em uma única **Release de Produção**.
* Essencial para conformidade com processos ágeis de homologação (ex: *Sarbanes-Oxley / SOX* e auditoria corporativa).

### 4. 🖥️ Ambientes (Clusters n8n)
* Registro e gestão de instâncias remotas do n8n (ex: `DEVELOPMENT`, `STAGING`, `HOMOLOG`, `PRODUCTION`).
* Testador de conexões em tempo real que simula o handshake de tokens de API (`API Keys`).
* Restrição de segurança: Apenas administradores possuem privilégios para registrar ou remover clusters.

### 5. 🚀 Deploy & Rollback Seguro
* **Consola de Logs Operacionais**: Terminal interativo que simula canais gRPC e streams de logs detalhando o estado de cada nó durante a transmissão de carga de rede para o cluster n8n.
* **Rollback de Emergência**: Mecanismo de reversão ultrarrápido que clona as especificações de um snapshot estável anterior e gera um novo commit sequencial, garantindo que o histórico de auditoria permaneça contínuo e sem furos históricos.

### 6. 🛡️ Controle de Acesso Baseado em Perfis (RBAC)
* Sistema robusto de segurança baseado em quatro papéis (*Roles*):
  * **Administrator**: Acesso total a configurações, exclusões, usuários e clusters.
  * **Release Manager**: Responsável pelo empacotamento de releases e aprovações estáveis.
  * **Developer**: Permissão para codificar, commitar versões de workflows e realizar deploys em homologação.
  * **Viewer**: Acesso exclusivo de auditoria de leitura.
* Matriz interativa visual detalhada de regras e permissões por módulo no painel de Usuários.

### 7. 🕵️ Trilha de Auditoria Imutável
* Registro criptográfico detalhado e impossível de apagar de todas as operações realizadas na plataforma, contendo:
  * Nome e ID do operador.
  * Operação efetuada (ex: `LOGIN`, `ENVIRONMENT_CREATE`, `DEPLOY_EXECUTE`).
  * IP de origem da requisição.
  * Data/Hora precisa e resultado do evento (`SUCCESS` ou `FAILED`).

---

## 🛠️ Arquitetura Tecnológica

### Frontend (SPA)
* **React 19** & **Vite** para renderização veloz de interfaces e ciclo de vida otimizado.
* **Tailwind CSS v4** para estilização utilitária de alta performance.
* **Lucide React** para vetorização limpa e consistente de ícones.
* **Motion** para micro-animações de layout fluidas e transições de abas.
* **i18next** com suporte a múltiplos idiomas (`pt-BR`, `en-US`, `es-ES`).

### Backend (API Gateway)
* **Express (NodeJS)** para roteamento de endpoints REST rápidos.
* **TSX** para execução nativa e dinâmica de arquivos TypeScript.
* **ESBuild** para empacotamento (`bundling`) de produção unificado em formato CommonJS (`.cjs`).

### Persistência de Dados
* Banco de dados relacional emulado via arquivo JSON estruturado (`gitdog_db.json`) em desenvolvimento, garantindo inicialização instantânea e mock de sementes sem dependências externas pesadas de infraestrutura.

---

## 🚦 Executando o Projeto Localmente

### Pré-requisitos
Certifique-se de ter o **Node.js (versão 18 ou superior)** instalado em seu sistema operacional.

### 1. Instalar as Dependências
No diretório raiz do projeto, execute o comando abaixo para instalar as bibliotecas do ecossistema React, Tailwind, Express e compiladores:
```bash
npm install
```

### 2. Modo de Desenvolvimento (Dev Server)
Para rodar a aplicação em tempo real com auto-reload (rebuilding instantâneo de APIs e assets estáticos no frontend):
```bash
npm run dev
```
O servidor será iniciado na porta padrão **3000**:
👉 Aceda em: `http://localhost:3000`

### 3. Compilação para Produção (Build)
Para compilar o frontend estático e empacotar o backend do Express em um arquivo único e ultra-rápido otimizado para containers em nuvem:
```bash
npm run build
```

### 4. Execução de Produção
Para iniciar a aplicação compilada utilizando o bundle otimizado:
```bash
npm run start
```

---

## 🐶 Atalhos de Login Rápidos para Teste de Perfis (RBAC)
No painel de autenticação, você pode testar imediatamente as diferentes visões do sistema clicando nos botões de atalho:

1. **Administrator**: `fsestelo@gmail.com` (Acesso total)
2. **Release Manager**: `jane@gitdog.com` (Empacotador de pacotes)
3. **Developer**: `thiago@gitdog.com` (Controle de commits e criação de fluxos)
4. **Viewer**: `alice@gitdog.com` (Visão de auditoria estrita)

---

Criado com 🧡 pela equipe **gitdog-caramelo**. Governança de integração n8n de forma elegante, estável e robusta.
