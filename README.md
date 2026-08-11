<div align="center">

# 🕹️ ARCADE Setor 7

**Um hub de 9 mini‑jogos em um único arquivo HTML — com placar online global, modo claro/escuro, efeitos sonoros e vibração (haptics).**

Feito 100% em HTML + CSS + JavaScript puro (sem framework, sem build). O placar global é opcional e usa uma _Netlify Function_ com **Postgres (Neon)**.

</div>

---

## ✨ Destaques

- 🎮 **9 jogos** completos num só arquivo.
- 🌐 **Placar online global** (opcional) via Netlify Functions + Neon Postgres — com _fallback_ automático para **modo local** quando não há backend.
- 🌙☀️ **Modo claro/escuro** (respeita a preferência do sistema) + **7 temas** de cor.
- 🔊 **Efeitos sonoros** (Web Audio) e 📳 **haptics** (vibração no celular), ambos com liga/desliga.
- 📱 **Mobile‑first**: alvos de toque grandes, sem zoom acidental por duplo‑toque, controles por _swipe_/D‑pad.
- ⚡ **Sem dependências no front‑end** e sem etapa de build — é só abrir o `index.html`.
- 🧩 **PWA‑ready**: ícones reais + `site.webmanifest`.

---

## 🎯 Os jogos

| Jogo | Descrição | Métrica do ranking |
|---|---|---|
| 🧨 **Campo Minado** | Radar analítico de probabilidade, Desafio Diário, modo Duelo local, "sem‑chute". | Melhor tempo (Fácil) |
| 🔤 **Termo** | Palavra de 5 letras. Solo, **Dueto** e **Quarteto**; palavra do dia + infinito. | Maior sequência diária |
| 🔢 **2048** | Junte os números até 2048. **Desfazer** (1 passo), setas/WASD/_swipe_. | Maior pontuação |
| 🐍 **Snake** | Cobra clássica com **modo Travessia** (parede atravessável) e rastro. | Maior pontuação |
| 🧠 **Memória** | Encontre os pares no menor tempo/jogadas. 3 tamanhos. | Melhor tempo (4×4) |
| ⭕ **Jogo da Velha** | IA **minimax** (Difícil é imbatível). Linha vencedora destacada. | Sequência sem derrota |
| 💡 **Lights Out** | Apague todas as luzes. **Dica** com solver por álgebra linear (GF(2)). | Menos jogadas |
| 🔴 **Liga 4** | Connect‑4 vs IA (negamax + alfa‑beta). Peças vencedoras destacadas. | Sequência sem derrota |
| 🧱 **Breakout** | Raquete, bola com brilho/rastro, partículas e níveis progressivos. | Maior pontuação |

---

## 🚀 Começando

### Rodar localmente
Como é um único HTML, basta abrir o arquivo:

```bash
# clone o repositório
git clone https://github.com/<seu-usuario>/arcade-setor-7.git
cd arcade-setor-7

# opção 1: abrir direto
#   dê um duplo clique em index.html

# opção 2: servidor local (recomendado)
python3 -m http.server 8000
#   depois abra http://localhost:8000
```

> Aberto localmente, o **placar funciona em modo local** (salvo no navegador). Para ranking global, veja abaixo.

---

## ☁️ Deploy

### Opção A — Arrastar e soltar (mais simples, placar local)
1. Acesse **[app.netlify.com/drop](https://app.netlify.com/drop)**.
2. Arraste a **pasta do projeto** para a área indicada.
3. Você recebe um link `*.netlify.app` em segundos.

### Opção B — Placar online GLOBAL (Neon + Netlify)
1. Crie um Postgres grátis em **[neon.com](https://neon.com)** e copie a _connection string_.
2. Suba este repositório no GitHub.
3. No Netlify: **Add new site → Import from GitHub** → selecione o repo → **Deploy**.
4. Em **Site configuration → Environment variables**, adicione:
   ```
   DATABASE_URL = postgresql://usuario:senha@ep-xxxx-pooler.regiao.aws.neon.tech/neondb?sslmode=require
   ```
5. Refaça o deploy. O selo do placar muda de **Local** para **🟢 Online**.

> A tabela do banco é criada automaticamente na primeira chamada da API — você não precisa rodar nenhum SQL.

---

## 🗂️ Estrutura do projeto

```
.
├── index.html                      # o app inteiro (HTML + CSS + JS)
├── favicon.ico                     # ícone (aba do navegador)
├── apple-touch-icon.png            # ícone iOS / atalho na tela
├── icon-192.png                    # ícone PWA
├── icon-512.png                    # ícone PWA
├── site.webmanifest                # manifesto do PWA
├── netlify.toml                    # config do Netlify (Node 20 + functions)
├── package.json                    # dependência do placar
└── netlify/
    └── functions/
        └── leaderboard.mjs         # API do placar (Neon Postgres)
```

---

## 🧠 Como funciona

### Arquitetura
- **Front‑end**: um `index.html` com 4 blocos `<script>` — uma _ponte_ de armazenamento, um barramento de eventos (`ArcadeBus`), os módulos dos jogos e o **placar**. Cada jogo é um módulo isolado (IIFE) que emite eventos ao terminar.
- **Placar**: ao pontuar, o jogo emite um evento; o módulo de placar envia via `fetch` para a Netlify Function. Se a função não responder (ex.: `file://`), ele **cai para o modo local** sozinho.

### API do placar
| Método | Rota | Descrição |
|---|---|---|
| `GET`  | `/api/leaderboard?game=g2048&limit=50` | Top N de um jogo |
| `POST` | `/api/leaderboard` — `{game, playerId, name, value}` | Envia pontuação (mantém o melhor) |

Cada jogo tem uma **direção** de ranking: `desc` (maior é melhor) ou `asc` (menor tempo/jogadas). A função faz um **UPSERT "guardar apenas o melhor"** atômico no Postgres.

### Esquema do banco (criado automaticamente)
```sql
CREATE TABLE IF NOT EXISTS scores (
  game       text    NOT NULL,
  player_id  text    NOT NULL,
  name       text    NOT NULL,
  value      integer NOT NULL,
  ts         bigint  NOT NULL,
  PRIMARY KEY (game, player_id)
);
```

---

## ⚙️ Configuração

| O quê | Onde | Valor |
|---|---|---|
| Ligar/desligar placar online | `index.html` → bloco `<!-- PLACAR ONLINE -->` | `ONLINE_CONFIG.apiUrl = "/api/leaderboard"` (ou `""` para só local) |
| Conexão do banco | Netlify → Environment variables | `DATABASE_URL` |
| Versão do Node | `netlify.toml` | `NODE_VERSION = "20"` (driver do Neon exige 19+) |

---

## 🎨 Temas e acessibilidade
- Temas: **Clássico** (padrão), Selva, Deserto, Cyber Grid, Pixel Arcade, Blueprint, Noir.
- **Modo claro/escuro** independente do tema, com contraste **WCAG AAA** no texto.
- Respeita `prefers-color-scheme` e `prefers-reduced-motion`.

---

## 🕹️ Controles

| Jogo | Teclado | Toque |
|---|---|---|
| Campo Minado | Setas + Enter (revelar) + F (bandeira) | Toque curto / toque longo (bandeira) |
| Termo | Digitação + Enter/Backspace | Teclado na tela |
| 2048 | Setas / WASD | _Swipe_ |
| Snake | Setas / WASD | D‑pad / _swipe_ |
| Breakout | Setas + Espaço (lançar) | Arrastar + toque (lançar) |
| Velha / Liga 4 / Lights / Memória | Clique | Toque |

---

## 🔒 Privacidade
- O placar não tem login. As pontuações são **anônimas** (apelido de até 16 caracteres, validado no servidor).
- Nenhum dado pessoal é coletado. Preferências (tema, som, apelido, recordes) ficam no **localStorage** do seu navegador.

---

## 🛠️ Tecnologias
- HTML5, CSS3 (Custom Properties, Grid, Container Queries), JavaScript (ES2020+), Canvas 2D, Web Audio API, Vibration API.
- **Netlify Functions** (v2) + **@neondatabase/serverless** (Postgres).


<div align="center">

Feito com ☕ e muitos `console.log`. **Bom jogo!** 🎮

</div>
