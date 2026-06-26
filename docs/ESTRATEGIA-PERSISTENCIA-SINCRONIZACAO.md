# Estratégia de Persistência e Sincronização (Decisão D2)

**Data:** 2026-06-26
**Versão:** 1.0
**Issue:** #43
**Épico:** #41 — Melhorar persistência do progresso
**Depende de:** #42 — Mapeamento de tabelas e endpoints do backend

---

## 1. Contexto da Decisão

| Fato técnico | Impacto na decisão |
|---|---|
| App é um PWA com `sw.js` usando cache-first para assets | Funcionamento offline é requisito de produto |
| No GitHub Pages, `public/services/api.js` define `BASE_URL = ''`, desabilitando a API | Produção já opera 100% sem backend |
| Backend usa **PGlite** (PostgreSQL via WASM em memória) — não um servidor PostgreSQL persistente externo | O banco não sobrevive entre reinicializações sem configuração de persistência em disco |
| `public/js/storageManager.js` implementa toda a persistência via `localStorage` | Local-first já é a realidade operacional do projeto |
| `public/js/userManager.js` tenta criar usuário via API e faz fallback para `localStorage` em caso de falha | O padrão try-API-then-local já está implementado |
| Usuários são anônimos — sem autenticação ou login | Identidade é gerada e custodiada no dispositivo do usuário |

---

## 2. Prós e Contras de Cada Estratégia

### Local-First (localStorage como fonte de verdade)

**Prós:**
- Latência zero — operações síncronas no `localStorage`
- Funciona 100% offline — requisito PWA garantido
- Já implementado e coberto por testes (`__tests__/storageManager.test.js`)
- Independente do estado do servidor PGlite (que é volátil em memória)
- Compatível com usuários anônimos — sem necessidade de auth
- Resiliente — app funciona mesmo se o backend estiver indisponível

**Contras:**
- Dados presos no dispositivo — perdidos ao limpar cache ou trocar de navegador
- Limite prático de ~5–10 MB no `localStorage` (mitigado: histórico limitado a 50 entradas)
- Sem sincronização entre dispositivos
- Sem dados centralizados para analytics ou leaderboard real

### Backend-First (PGlite como fonte de verdade)

**Prós:**
- Dados centralizados habilitam leaderboard real e analytics
- Sem limite prático de armazenamento

**Contras:**
- Viola o requisito PWA offline — operações bloqueariam sem conexão ativa
- O PGlite em memória perde dados entre reinicializações sem configuração de persistência em disco
- Em produção (GitHub Pages) a API é desabilitada — backend-first tornaria o app não funcional em produção
- Requer gerenciamento de identidade anônima server-side
- Latência em cada operação de leitura/escrita

---

## 3. Decisão D2: Local-First com Sincronização Opcional

**Estratégia adotada: LOCAL-FIRST.**

A sincronização com o backend é oportunista e não-bloqueante: executada quando o servidor está disponível, silenciosamente ignorada quando não está.

**Justificativa:**

1. **Requisito de produto não negociável.** O app deve funcionar offline. Em produção (GitHub Pages), a API é explicitamente desabilitada pelo `api.js`. Backend-first quebraria o app em produção.

2. **Backend volátil por natureza.** O PGlite opera em memória. Sem configuração de persistência em disco, dados do backend não sobrevivem entre reinicializações do servidor. `localStorage` é mais durável que o banco atual em cenários de uso real.

3. **Padrão já implementado.** O `userManager.js` já adota try-API-then-local. Formalizar local-first documenta e consolida o que já existe, sem forçar mudança arquitetural.

4. **Modelo de usuário anônimo.** Não há autenticação. A identidade do usuário (`aws_sim_user_id`) é gerada no cliente e representa a âncora de qualquer sincronização futura.

---

## 4. Regras de Sincronização

### 4.1 Identificação do Usuário

- Na primeira carga, gera-se um UUID v4 persistido em `localStorage` com a chave `aws_sim_user_id`
- Ao tentar criar usuário via `POST /api/users`, o UUID retornado pelo servidor é armazenado localmente
- Se a API falhar, um UUID é gerado localmente com prefixo `fallback:` (ver `storageManager.js`)
- O UUID nunca é regenerado na mesma instalação

### 4.2 Quando Sincronizar

| Gatilho | Ação |
|---|---|
| Conclusão de quiz | Tentar `POST /api/quiz` com o resultado; em caso de falha, enfileirar |
| App volta ao foreground após período offline | Processar fila de operações pendentes |
| Verificação de disponibilidade (`api.isAvailable()`) retorna `true` | Processar fila de operações pendentes |

### 4.3 Política de Retry

- Timeout por request: 2 segundos (conforme `API_CONFIG.TIMEOUT`)
- 1 tentativa imediata (conforme `API_CONFIG.RETRY_ATTEMPTS`)
- Em caso de falha: item permanece na fila local; app continua normalmente
- Sem limite de tempo para itens na fila — dados locais são preservados indefinidamente

### 4.4 Disponibilidade da API

A função `apiService.isAvailable()` (em `public/services/api.js`) deve ser consultada antes de qualquer operação de sincronização. Ela retorna `false` automaticamente quando:
- `BASE_URL` está vazio (produção no GitHub Pages)
- O health check em `GET /api/health` falha ou expira

---

## 5. Resolução de Conflitos

Conflitos só ocorrem quando o mesmo usuário opera em múltiplos dispositivos ou após limpar e recriar `localStorage`. A estratégia por tipo de dado:

| Dado | Tipo de conflito | Estratégia |
|---|---|---|
| `quiz_history` / `answers` | Append-only — sem conflito real | Inserir no backend se não existir (idempotência por timestamp) |
| `gamification.totalQuizzes` | Contadores podem divergir | Tomar o valor máximo |
| `gamification.bestScore` | Scores diferentes por dispositivo | Tomar o valor máximo |
| `gamification.currentStreak` + `lastDate` | Streaks divergentes | Tomar o registro com `lastDate` mais recente |
| `gamification.badges` | Badges desbloqueados em dispositivos distintos | União dos conjuntos (nunca revogar badge) |
| `gamification.completedStages` / `unlockedStages` | Progresso de trilha divergente | União dos conjuntos |
| `focus_sessions` | Append-only — sem conflito real | Inserir no backend se não existir |

**Regra geral:** em caso de dúvida, favorecer o progresso maior. Nunca regredir dados de gamificação.

---

## 6. Resumo

| Item | Status |
|---|---|
| Estratégia | Local-first com sync opcional |
| Fonte de verdade | `localStorage` (via `storageManager.js`) |
| Sincronização | Oportunista, não-bloqueante, via `apiService` |
| Produção (GitHub Pages) | 100% local — API desabilitada |
| Desenvolvimento local | Try-API → fallback localStorage |
| Resolução de conflitos | Maior valor vence; conjuntos são unidos |
