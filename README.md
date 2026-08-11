# 🕹️ ARCADE Setor 7 — Hub de Mini‑Jogos

**Progressive Web App (PWA) com 9 mini‑jogos em um único arquivo HTML.** Leve, responsivo e instalável, com placar online global (opcional), modo claro/escuro, efeitos sonoros, vibração (haptics) e funcionamento **offline**. 🎮

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
![Neon](https://img.shields.io/badge/Neon_Postgres-00E599?style=for-the-badge&logo=postgresql&logoColor=white)

![9 jogos](https://img.shields.io/badge/jogos-9-orange?style=flat-square)
![Frontend sem dependências](https://img.shields.io/badge/frontend-sem%20depend%C3%AAncias-brightgreen?style=flat-square)
![Vanilla JS](https://img.shields.io/badge/vanilla-JS-yellow?style=flat-square)
![Responsivo](https://img.shields.io/badge/responsivo-100%25-blue?style=flat-square)
![Offline](https://img.shields.io/badge/funciona-offline-success?style=flat-square)
![Instalável](https://img.shields.io/badge/PWA-instal%C3%A1vel-5A0FC8?style=flat-square)

---

## ✨ Destaques

- 📲 **Instalável (PWA)** — desktop, Android e iOS, com *service worker* e **funcionamento offline** após a 1ª visita.
- 🎮 **9 jogos completos** num só arquivo — de Campo Minado a Breakout.
- 🌐 **Placar online global** (opcional) via Netlify Functions + **Postgres (Neon)**, com *fallback* automático para **modo local**.
- 🌙☀️ **Modo claro/escuro** + **7 temas** de cor (Clássico, Selva, Cyber Grid, Pixel Arcade, Blueprint, Noir, Deserto).
- 🔊 **Som** (Web Audio) e 📳 **haptics** (vibração no celular), ambos com liga/desliga.
- ⚡ **Zero dependências no front‑end** — HTML, CSS e JavaScript puro (*vanilla*). Sem framework, sem *build*.

---

## 🕹️ Os jogos

| Jogo | Descrição | Ranking |
|---|---|---|
| 🧨 **Campo Minado** | Radar analítico de probabilidade, Desafio Diário, modo Duelo local e gerador "sem‑chute". | Melhor tempo (Fácil) |
| 🔤 **Termo** | Palavra de 5 letras — **Solo**, **Dueto** e **Quarteto**; palavra do dia + modo infinito. | Maior sequência diária |
| 🔢 **2048** | Junte os números até 2048, com **Desfazer** (1 passo) e tiles com gradiente. | Maior pontuação |
| 🐍 **Snake** | Cobra clássica com **modo Travessia** (parede atravessável) e rastro/brilho. | Maior pontuação |
| 🧠 **Memória** | Encontre os pares no menor tempo/jogadas — 3 tamanhos de tabuleiro. | Melhor tempo (4×4) |
| ⭕ **Jogo da Velha** | IA **minimax** (Difícil é imbatível) e **linha vencedora** destacada. | Sequência sem derrota |
| 💡 **Lights Out** | Apague todas as luzes, com **Dica** por álgebra linear (GF(2)). | Menos jogadas |
| 🔴 **Liga 4** | Connect‑4 vs IA (negamax + alfa‑beta), com **peças vencedoras** destacadas. | Sequência sem derrota |
| 🧱 **Breakout** | Raquete, bola com brilho/rastro, partículas e **níveis** progressivos. | Maior pontuação |

---

## 🚀 Funcionalidades

| Recurso | Descrição |
|---|---|
| **Hub central** | Grade com os 9 jogos, painel "Seu progresso" e o placar global. Navegação por *deep‑link* (`#mines`, `#termo`, …). |
| **Placar online** | Envio e Top 10 por jogo via API `/api/leaderboard`. Sem backend, cai para o **modo local** (salvo no navegador). |
| **PWA / Offline** | *Manifest* + *service worker*: instala na tela inicial e abre sem internet; atualização automática. |
| **Claro/Escuro + temas** | Alternância ☀️/🌙 (respeita o sistema) sobre 7 paletas, com contraste **WCAG AAA** no texto. |
| **Som & Haptics** | Efeitos sonoros e vibração por evento (comer, quebrar, vencer, errar…), com controles próprios. |
| **Mobile‑first** | Alvos de toque grandes, **sem zoom por duplo‑toque**, controles por *swipe* e D‑pad. |

---

## 🛠️ Tecnologias

- **HTML5** semântico (arquivo único).
- **CSS3** — Grid, Flexbox, *custom properties*, *container queries*, animações, `backdrop-filter`, *media queries*.
- **JavaScript (ES2020+)** — sem bibliotecas no front‑end.
- **Web APIs** — Service Worker, Web App Manifest, **Canvas 2D**, **Web Audio**, **Vibration**, `localStorage`, `matchMedia`.
- **Backend do placar** — **Netlify Functions** (v2) + **@neondatabase/serverless** (Postgres).

---

## 📂 Estrutura do projeto

```
arcade-setor-7/
├── index.html                 # o app inteiro (marcação + CSS + JS)
├── sw.js                      # service worker (cache/offline + update)
├── site.webmanifest           # configuração do PWA (nome, ícones, atalhos)
├── favicon.ico / favicon.svg  # ícone da aba
├── apple-touch-icon.png       # ícone iOS
├── icon-192.png / icon-512.png              # ícones (purpose: any)
├── icon-192-maskable.png / icon-512-maskable.png   # ícones "maskable" (Android)
├── icon-48.png                # ícone pequeno
├── netlify.toml               # config Netlify (Node 20 + headers do SW)
├── package.json               # dependência do placar (@neondatabase/serverless)
└── netlify/
    └── functions/
        └── leaderboard.mjs    # API do placar (Neon Postgres)
```

---

## ▶️ Como executar localmente

Como o projeto usa **Service Worker**, ele precisa ser servido via **HTTP(S)** — abrir o `index.html` direto pelo `file://` faz os jogos rodarem, mas **não habilita o PWA** (instalar/offline).

**Opção 1 — Python:**
```bash
git clone https://github.com/<seu-usuario>/arcade-setor-7.git
cd arcade-setor-7
python -m http.server 8080
# acesse http://localhost:8080
```

**Opção 2 — Node (serve):**
```bash
npx serve .
```

**Opção 3 — VS Code:** extensão *Live Server* → *Open with Live Server*.

---

## 📲 Instalação (PWA)

- **Android (Chrome/Edge):** botão **"⬇️ Instalar"** na barra do topo ou menu **⋮ → Adicionar à tela inicial**.
- **Desktop (Chrome/Edge):** botão **"⬇️ Instalar"** no topo ou o ícone de instalação na barra de endereço.
- **iOS (Safari):** **Compartilhar → Adicionar à Tela de Início** (o app mostra uma dica automática).

Após instalado, abre em tela cheia, com ícone próprio, como um aplicativo nativo. *(Requer HTTPS — o Netlify fornece.)*

---

## 🌐 Placar online (opcional)

Sem configurar nada, o placar funciona em **modo local** (só neste navegador). Para um **ranking global**:

1. Crie um Postgres grátis em **[neon.com](https://neon.com)** e copie a *connection string*.
2. Suba o projeto no GitHub → **Netlify → Import from GitHub** → **Deploy**.
3. Em **Site configuration → Environment variables**, adicione:
   ```
   DATABASE_URL = postgresql://usuario:senha@ep-xxxx-pooler.regiao.aws.neon.tech/neondb?sslmode=require
   ```
4. Refaça o *deploy* → o selo do placar muda para **🟢 Online**.

> A tabela do banco é criada automaticamente na primeira chamada da API — sem rodar SQL.

---

## 🔄 Atualização do conteúdo

O app é editado diretamente no `index.html` (arquivo único). Ao publicar mudanças, **incremente a versão do cache** em `sw.js` (constante `VERSION`) para que os usuários recebam a nova versão automaticamente.

---

## 🌐 Deploy

Front‑end 100% estático; o placar usa uma *function* serverless.

- **Netlify** (deploy por *drag & drop* da pasta, ou via GitHub) ✅ *recomendado*
- Vercel / Cloudflare Pages (para o placar, configure a *function* equivalente)
- GitHub Pages *(apenas o front‑end; sem o placar online)*

---

## 📄 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo `LICENSE` para mais detalhes.

---

Feito com ☕ e muitos `console.log`. **Bom jogo!** 🎮
