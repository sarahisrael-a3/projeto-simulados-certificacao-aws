# Leia-Me Primeiro

Atualizado em: 2026-06-25

Se voce e novo no projeto, comece aqui.

## O Que E Este Projeto

Um simulador de estudos para certificacoes AWS com:

- frontend SPA/PWA;
- dados JSON versionados;
- API Express local;
- banco PGlite;
- validacao colaborativa de questoes;
- diagnostico com simulado personalizado para dominios fracos;
- automacoes Python;
- testes Jest.

## Comecar Em 3 Passos

```bash
npm install
npm run dev
```

Abra a URL exibida pelo terminal.

## Rodar Completo Com API

```bash
cp .env.example .env
npm run db:seed
npm run api:start
```

Em outro terminal:

```bash
npm run dev
```

No PowerShell, use:

```powershell
Copy-Item .env.example .env
```

## Documentos Importantes

| Documento | Use para |
| --- | --- |
| `README.md` | Visao geral e comandos |
| `docs/ONBOARDING_VISUAL.md` | Entender rapido |
| `docs/GUIA-INICIANTES.md` | Aprender passo a passo |
| `docs/ARCHITECTURE.md` | Entender arquitetura |
| `docs/API.md` | Ver contrato principal da API |
| `docs/ROUTES_AND_INTEGRATIONS.md` | Ver rotas reais |
| `docs/CHECKLIST.md` | Ver status atual |
| `docs/ROADMAP.md` | Ver proximas fases |
| `docs/EPICOS-E-TASKS.md` | Ver epicos e tasks |
| `docs/CONTRIBUTING.md` | Contribuir |

## Checklist Inicial

- [ ] Tenho Node.js 18+.
- [ ] Rodei `npm install`.
- [ ] Rodei `npm run dev`.
- [ ] Vi o frontend abrindo.
- [ ] Li `docs/ONBOARDING_VISUAL.md`.
- [ ] Entendi que `src/` e fonte e `public/` e build.

## Se Voce Quer Contribuir

- Para questoes: use `data/contributions/`.
- Para frontend: edite `src/frontend/`.
- Para API: edite `backend/api/`.
- Para banco: edite `backend/database/`.
- Para scripts: edite `src/python/scripts/`.
- Para docs: edite `docs/`.

Antes do PR:

```bash
npm test -- --runInBand
npm run build
```

## Estado Atual Medido

- Testes em 2026-06-25: 9 suites, 82 testes passando.
- Build em 2026-06-25: passou.
- Base principal: 2.545 registros JSON PT/EN.
