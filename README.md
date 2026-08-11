<div align="center">

# 🕹️ ARCADE Setor 7

**Hub de 9 mini‑jogos em um único HTML — agora um PWA instalável (desktop e mobile), com placar online global, modo claro/escuro, som e haptics.**

HTML + CSS + JavaScript puro, sem framework e sem build. Funciona offline após a 1ª visita. O placar global é opcional (Netlify Functions + Postgres/Neon).

</div>

---

## ✨ Destaques

- 📲 **PWA instalável** (Android, iOS e desktop) com **Service Worker** — abre **offline** e atualiza sozinho.
- 🎮 **9 jogos** completos num só arquivo.
- 🌐 **Placar online global** (opcional) com _fallback_ automático para **modo local**.
- 🌙☀️ **Modo claro/escuro** + **7 temas** de cor.
- 🔊 **Som** (Web Audio) e 📳 **haptics** (vibração no celular).
- 📱 Mobile‑first: toques grandes, sem zoom por duplo‑toque, _swipe_/D‑pad.

---

## 🎯 Os jogos

| Jogo | Destaques | Ranking |
|---|---|---|
| 🧨 **Campo Minado** | Radar de probabilidade, Desafio Diário, Duelo, sem‑chute | Melhor tempo (Fácil) |
| 🔤 **Termo** | Solo/Dueto/Quarteto, palavra do dia + infinito | Maior sequência diária |
| 🔢 **2048** | **Desfazer** (1 passo), tiles com gradiente | Maior pontuação |
| 🐍 **Snake** | **Modo Travessia**, rastro/brilho | Maior pontuação |
| 🧠 **Memória** | 3 tamanhos, som/haptic | Melhor tempo (4×4) |
| ⭕ **Jogo da Velha** | IA minimax (imbatível), **linha vencedora** destacada | Sequência sem derrota |
| 💡 **Lights Out** | **Dica** por álgebra linear (GF(2)) | Menos jogadas |
| 🔴 **Liga 4** | IA negamax + alfa‑beta, peças vencedoras destacadas | Sequência sem derrota |
| 🧱 **Breakout** | Partículas, níveis, bola com brilho | Maior pontuação |

---

## 📲 Instalar o app

- **Android / Chrome / Edge:** botão **⬇️ Instalar** no topo (ou menu ⋮ → _Instalar app_).
- **Desktop (Chrome/Edge):** botão **⬇️ Instalar** ou o ícone de instalação na barra de endereço.
- **iPhone/iPad (Safari):** **Compartilhar → Adicionar à Tela de Início** (o app mostra uma dica automática).

> Requer HTTPS (o Netlify fornece). Depois da 1ª visita, o app abre **offline**.

---

## 🚀 Rodar localmente

```bash
git clone https://github.com/<seu-usuario>/arcade-setor-7.git
cd arcade-setor-7
python3 -m http.server 8000   # abra http://localhost:8000
```
> O Service Worker exige `http(s)://` — via `file://` os jogos funcionam, mas sem instalar/offline.

---

## ☁️ Deploy

**A) Rápido (placar local):** arraste a pasta em **app.netlify.com/drop**.

**B) Placar GLOBAL (Neon + Netlify):**
1. Crie um Postgres grátis em **neon.com** e copie a _connection string_.
2. Suba no GitHub → **Netlify → Import from GitHub** → Deploy.
3. Em **Environment variables**, adicione `DATABASE_URL` (a string do Neon).
4. Redeploy → o placar vira **🟢 Online**.

---

## 🗂️ Estrutura

```
.
├── index.html                 # o app (HTML+CSS+JS)
├── sw.js                      # Service Worker (offline + update)
├── site.webmanifest           # manifesto PWA (ícones + atalhos)
├── favicon.ico / favicon.svg
├── apple-touch-icon.png
├── icon-192.png / icon-512.png
├── icon-192-maskable.png / icon-512-maskable.png
├── netlify.toml               # Node 20 + headers do SW
├── package.json
└── netlify/functions/leaderboard.mjs
```

---

## 🧠 Como funciona (PWA)

- **Service Worker (`sw.js`)**: navegação em **network‑first** (com fallback ao cache = offline); estáticos em **cache‑first**; Google Fonts em **stale‑while‑revalidate**; a API do placar **nunca** é cacheada. Atualização automática (skipWaiting + reload da aba).
- **Manifest**: ícones **any + maskable**, `display: standalone`, atalhos para jogos, cores de tema.
- **Instalação**: captura `beforeinstallprompt` (botão Instalar) e detecta iOS/Safari para a dica de _Adicionar à Tela de Início_.

### API do placar
| Método | Rota | Uso |
|---|---|---|
| `GET`  | `/api/leaderboard?game=g2048&limit=50` | Top N |
| `POST` | `/api/leaderboard` `{game,playerId,name,value}` | Enviar (mantém o melhor) |

---

## 🔒 Privacidade
Sem login. Pontuações anônimas (apelido ≤16). Preferências ficam no `localStorage`.

## 📄 Licença
MIT — veja `LICENSE`.

<div align="center">

**Bom jogo!** 🎮

</div>
