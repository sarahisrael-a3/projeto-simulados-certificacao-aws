# 📝 Contribuições de Questões - Guia Rápido

Esta pasta permite que você contribua com novas questões **sem conflitos de merge**!

## 🎯 Como Contribuir com Novas Questões

### Passo 1: Crie um arquivo individual

Crie um arquivo JSON na pasta correspondente à certificação:

```
data/contributions/
├── clf-c02/
│   └── sua-questao-unica-123.json
├── saa-c03/
│   └── sua-questao-unica-456.json
├── aif-c01/
│   └── sua-questao-unica-789.json
└── dva-c02/
    └── sua-questao-unica-012.json
```

### Passo 2: Use o template

Copie o arquivo `_TEMPLATE.json` e preencha com sua questão:

```bash
cp data/contributions/_TEMPLATE.json data/contributions/clf-c02/minha-questao-s3.json
```

### Passo 3: Valide sua questão

Execute o script de validação antes de fazer commit:

```bash
python scripts_python/validate_contribution.py data/contributions/clf-c02/minha-questao-s3.json
```

### Passo 4: Faça o Pull Request

Seu PR conterá apenas **1 arquivo novo**, evitando conflitos com outras contribuições!

## 🔄 Merge Automático

Os mantenedores executarão periodicamente:

```bash
python scripts_python/merge_contributions.py clf-c02
```

Isso consolidará todas as contribuições validadas no arquivo principal `clf-c02.json`.

## ✅ Regras de Nomenclatura

- Use nomes descritivos: `questao-s3-versionamento.json`
- Evite caracteres especiais (use apenas letras, números e hífens)
- Seja específico sobre o tópico da questão

## 🚫 O que NÃO fazer

- ❌ Não edite os arquivos principais (`clf-c02.json`, `saa-c03.json`, etc.)
- ❌ Não crie arquivos com nomes genéricos (`questao1.json`, `nova.json`)
- ❌ Não submeta múltiplas questões no mesmo arquivo

## 📚 Recursos

- [Template de Questão](./_TEMPLATE.json)
- [Guia de Contribuição](../../CONTRIBUTING.md)
- [Documentação Completa](../../docs/)
