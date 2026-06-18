# Scripts Python

Atualizado em: 2026-06-18

Esta pasta contem automacoes para geracao, traducao, validacao, auditoria e merge de questoes.

## Instalar

Na raiz do projeto:

```bash
pip install -r src/python/scripts/requirements.txt
```

Alguns scripts usam APIs externas. Configure `.env` conforme necessario:

```env
GEMINI_API_KEY=sua-chave
GOOGLE_API_KEY=sua-chave
GROQ_API_KEY=sua-chave
```

## Scripts Principais

| Script | Funcao |
| --- | --- |
| `auto_generate_questions.py` | Gera questoes de forma balanceada |
| `quick_generate.py` | Gera lote rapido |
| `generator.py` | Motor de geracao |
| `aws_semantic_validator.py` | Valida qualidade semantica AWS |
| `sanity_check.py` | Checagens basicas dos dados |
| `duplicate_detector.py` | Detecta semelhancas e duplicidades |
| `translate_with_api.py` | Traduz usando API |
| `translate_aws_questions.py` | Traduz por regras/padroes |
| `convert_flashcards_bilingual.py` | Converte flashcards bilingues |
| `validate_contribution.py` | Valida arquivos em `data/contributions/` |
| `merge_contributions.py` | Consolida contribuicoes aprovadas |
| `pipeline_runner.py` | Orquestra fluxo de pipeline |
| `migrate_to_postgres.py` | Apoio/migracao para banco |

## Validar Uma Contribuicao

```bash
python src/python/scripts/validate_contribution.py data/contributions/clf-c02/minha-questao.json
```

## Detectar Duplicatas

```bash
python src/python/scripts/duplicate_detector.py
```

## Gerar Questoes

```bash
python src/python/scripts/quick_generate.py clf-c02 easy 5
python src/python/scripts/auto_generate_questions.py clf-c02
```

## Traduzir

```bash
python src/python/scripts/translate_with_api.py clf-c02
python src/python/scripts/translate_with_api.py all
```

## Merge De Contribuicoes

```bash
python src/python/scripts/merge_contributions.py clf-c02
```

Depois de alterar dados:

```bash
npm test -- --runInBand
npm run build
```

## Cuidados

- Faca backup ou trabalhe em branch antes de scripts que alteram JSONs principais.
- Nao commite chaves de API.
- Revise manualmente questoes geradas por IA.
- Rode validacoes antes de abrir PR.
