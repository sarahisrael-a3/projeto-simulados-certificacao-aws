# Mapeamento de Rotas e Integrações

Documento que mapeia todas as rotas, fetch calls e integrações do projeto.

## 📋 Sumário Executivo

| Item | Status | Porta | Descrição |
|------|--------|-------|-----------|
| Frontend (Live Server) | ✅ | 8000 | Serve `public/` com auto-reload |
| Backend (Node.js) | ⏳ | 3000 | `npm run db:dev` (opcional) |
| Data Files | ✅ | 8000 | Copiados para `public/data/` via build |
| API Endpoints | 📝 | N/A | Mapeados mas não implementados |

---

## 🔄 Fluxo de Requisições

```
Cliente (Frontend)
    ↓
    ├─→ GET /data/{certId}.json
    ├─→ GET /data/nivelamento/diagnostic-{certId}.json
    ├─→ GET /data/gamificacao/interactive-challenges.json
    └─→ Service Worker (intercepta .json files)
```

---

## 📂 Estrutura de Dados e Arquivos

### Localização Original (Desenvolvimento)
```
projeto-root/
├── data/
│   ├── clf-c02.json
│   ├── clf-c02-en.json
│   ├── saa-c03.json
│   ├── saa-c03-en.json
│   ├── dva-c02.json
│   ├── dva-c02-en.json
│   ├── aif-c01.json
│   ├── aif-c01-en.json
│   ├── nivelamento/
│   │   ├── diagnostic-clf-c02.json
│   │   ├── diagnostic-clf-c02-en.json
│   │   ├── diagnostic-saa-c03.json
│   │   ├── diagnostic-saa-c03-en.json
│   │   ├── diagnostic-dva-c02.json
│   │   ├── diagnostic-dva-c02-en.json
│   │   ├── diagnostic-aif-c01.json
│   │   └── diagnostic-aif-c01-en.json
│   └── gamificacao/
│       └── interactive-challenges.json
├── src/
│   └── frontend/
│       ├── js/
│       └── styles/
└── public/
    ├── index.html
    └── (vazio antes do build)
```

### Localização Servida (Runtime - após `npm run build`)
```
public/
├── index.html
├── js/          ← Copiado de src/frontend/js/
├── css/         ← Copiado de src/frontend/styles/
├── data/        ← Copiado de /data/ (NOVO!)
│   ├── clf-c02.json
│   ├── nivelamento/
│   └── gamificacao/
└── manifest.json
```

---

## 🎯 Todas as Fetch Calls

### 1. Quiz Principal
**Localização**: `src/frontend/js/quizEngine.js:33`
**Chamada**:
```javascript
const fileSuffix = language === 'en' ? '-en' : '';
const response = await fetch(`data/${certId}${fileSuffix}.json`);
```
**Exemplo**: `GET /data/clf-c02.json` ou `GET /data/clf-c02-en.json`
**Status**: ✅ Funciona (dados em `public/data/`)

### 2. Teste Diagnóstico
**Localização**: `src/frontend/js/quizEngine.js:73-81`
**Chamada**:
```javascript
const fileSuffix = language === 'en' ? '-en' : '';
let filePath = `data/nivelamento/diagnostic-${certId}${fileSuffix}.json`;
let response = await fetch(filePath);
```
**Exemplo**: `GET /data/nivelamento/diagnostic-clf-c02.json`
**Status**: ✅ Funciona

### 3. Quiz (Carregamento Secundário)
**Localização**: `src/frontend/js/app.js:1350-1356`
**Chamada**:
```javascript
const fileSuffix = uiState.language === "en" ? "-en" : "";
const response = await fetch(`data/${certId}${fileSuffix}.json`);
```
**Status**: ✅ Funciona

### 4. Desafios Interativos (Gamificação)
**Localização**: `src/frontend/js/gamificacao/interactiveEngine.js:19`
**Chamada**:
```javascript
const response = await fetch('data/gamificacao/interactive-challenges.json');
```
**Status**: ✅ Funciona

---

## 🔌 Service Worker Configuration

**Arquivo**: `public/sw.js`

### Estratégia de Cache
- **JSON files**: Network First (tenta rede primeiro, depois cache)
- **Outros assets**: Cache First (tenta cache, depois rede)

### Lógica
```javascript
// Para .json files
if (event.request.url.endsWith('.json') && !event.request.url.includes('manifest.json')) {
    event.respondWith(
        fetch(event.request).then(response => {
            // Faz cache se válido
            if (response && response.status === 200) {
                cache.put(event.request, responseClone);
            }
            return response;
        }).catch(err => {
            // Se offline, usa cache
            return caches.match(event.request);
        })
    );
}
```

---

## 🛠️ Build Process

**Arquivo**: `scripts/build.cjs`

### O que Faz
1. ✅ Copia `src/frontend/js/` → `public/js/`
2. ✅ Copia `src/frontend/styles/` → `public/css/`
3. ✅ **NEW**: Copia `data/` → `public/data/`

### Execução
```bash
npm run build   # Executa o script
npm run dev     # Executa build + live-server
```

---

## 📝 Endpoints Planejados (Não Implementados)

### Arquivos: `validation/js/validationAPI.js`

#### TODO: Pendentes de Implementação
```javascript
// Buscar questões pendentes
await fetch('/api/questions/pending');

// Validar questão
POST /api/questions/{id}/validate
Body: { status: 'approved' | 'rejected' }

// Listar questões
GET /api/questions

// Criar questão
POST /api/questions
Body: { question, options, correct, ... }
```

**Status**: 📝 Mocks com delay em vez de chamadas reais
**Próximo Passo**: Implementar backend em Node.js ou FastAPI

---

## 🐍 Backend Configuration (Opcional)

**Arquivo**: `.env.example` e `.env`

```ini
# FastAPI Backend (se implementar)
API_HOST=localhost
API_PORT=8000

# PostgreSQL Database (se usar)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aws_simulator
DB_USER=postgres
DB_PASSWORD=postgres

# Google Gemini API
GOOGLE_API_KEY=seu_key_aqui

# Groq API
GROQ_API_KEY=seu_key_aqui
```

**Status**: ⏳ Configurado mas não usado no frontend

---

## ✅ Checklist de Rotas

### Desenvolvimento (`npm run dev`)
- [x] Frontend em http://localhost:8000
- [x] Auto-reload habilitado
- [x] Dados em `/data/` servidos em `http://localhost:8000/data/`
- [x] Service Worker interceptando .json
- [x] Cache estratégia Network First para JSON

### Produção (GitHub Pages)
- [ ] Build process copia `data/` para `public/data/`
- [ ] GitHub Pages serve `public/` como root
- [ ] URLs relativas funcionam: `GET /data/clf-c02.json`

---

## 🔍 Troubleshooting

### Erro 404 em `/data/*.json`
**Causa**: Pasta `data/` não foi copiada para `public/`
**Solução**: Execute `npm run build`

### Service Worker não cacheando
**Causa**: Página aberta antes do Service Worker registrar
**Solução**: Limpar cache do navegador (DevTools → Storage → Clear)

### Live reload não funciona
**Causa**: Live Server não rodando
**Solução**: `npm run dev` ou `npx live-server public`

### Dados não atualizam
**Causa**: Cache está muito antigo
**Solução**: Abrir em aba privada ou limpar cache

---

## 📊 Resumo de Mudanças

| Data | Mudança | Status |
|------|---------|--------|
| 2026-06-02 | Criado eslint.config.js | ✅ |
| 2026-06-02 | Build script com data copy | ✅ |
| 2026-06-02 | Documentação de rotas | ✅ |

---

## 🔗 Referências

- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)

