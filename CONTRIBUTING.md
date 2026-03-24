# Contribuindo com o Cloud Certification Study Tool - By Guilda

Primeiramente, obrigado pelo interesse em contribuir! 🎉 
Este projeto é um laboratório colaborativo da nossa Guilda para aprendermos Cloud, Dados, UX e Desenvolvimento de Software na prática.

## 🛠 Como contribuir

1. Faça o **Fork** deste repositório.
2. Clone o seu fork para a sua máquina local: `git clone <link-do-seu-fork>`
3. Crie uma branch para a sua alteração:
   `git checkout -b feature/minha-nova-funcionalidade` ou `git checkout -b fix/correcao-bug`
4. Faça suas alterações e commit: `git commit -m "feat: adiciona 10 novas perguntas de SAA"`
5. Envie para o seu fork: `git push origin feature/minha-nova-funcionalidade`
6. Abra um **Pull Request (PR)** neste repositório.

## 🤝 Áreas de Contribuição

Você pode escolher a área que mais se alinha com seus objetivos de estudo:

### ☁️ Contribuir com Questões (NOVO FLUXO!)

**⚠️ IMPORTANTE**: Não edite mais os arquivos principais (`clf-c02.json`, `saa-c03.json`, etc.)!

Agora usamos um **sistema modular** que evita conflitos de merge:

#### Passo 1: Crie sua questão individual

```bash
# Copie o template
cp data/contributions/_TEMPLATE.json data/contributions/clf-c02/questao-s3-versionamento.json

# Ou para questões de múltipla resposta
cp data/contributions/_TEMPLATE_MULTIPLE_ANSWER.json data/contributions/clf-c02/questao-ec2-tipos.json
```

#### Passo 2: Preencha sua questão

Edite o arquivo JSON com sua questão. Exemplo:

```json
{
  "domain": "tecnologia",
  "subdomain": "armazenamento",
  "service": "Amazon S3",
  "difficulty": "medium",
  "type": "multiple-choice",
  "tags": ["s3", "versionamento", "backup"],
  "question": "Uma empresa precisa proteger dados contra exclusões acidentais...",
  "options": [
    "Habilitar versionamento no S3",
    "Usar apenas backups manuais",
    "Desabilitar todas as permissões",
    "Criar múltiplas contas AWS"
  ],
  "correct": 0,
  "explanation": "O versionamento do S3 mantém múltiplas versões...",
  "reference": "https://docs.aws.amazon.com/s3/",
  "contributor": {
    "name": "Seu Nome",
    "github": "seu-usuario",
    "date": "2026-03-24"
  }
}
```

#### Passo 3: Valide sua questão

```bash
python scripts_python/validate_contribution.py data/contributions/clf-c02/questao-s3-versionamento.json
```

#### Passo 4: Faça o Pull Request

Seu PR conterá apenas **1 arquivo novo**, evitando conflitos com outras contribuições!

```bash
git add data/contributions/clf-c02/questao-s3-versionamento.json
git commit -m "feat(clf-c02): adiciona questão sobre versionamento S3"
git push origin feature/questao-s3-versionamento
```

#### Como funciona o merge?

Os mantenedores executarão periodicamente:

```bash
python scripts_python/merge_contributions.py clf-c02
```

Isso consolidará todas as contribuições validadas no arquivo principal automaticamente!

### 💻 Desenvolvimento Web (`/js` e `/index.html`)

Criar novas funcionalidades, melhorar o motor do quiz (`quizEngine.js`) ou implementar PWA (`sw.js`).

### 🎨 UX / UI (`style.css`)

Melhorar a interface, responsividade, acessibilidade e experiência visual.

### 🐍 Automação (`/scripts_python`)

Melhorar nossos scripts de geração, tradução e validação de perguntas via IA.

### 📚 Documentação (`/docs`)

Melhorar nossos guias e tutoriais.

## 🚦 Boas Práticas

- Consulte a aba **Issues** do GitHub e procure pelas labels `good-first-issue` ou `help-wanted`.
- Antes de iniciar uma alteração muito grande, abra uma Issue para discutirmos a abordagem!
- Para questões, use sempre o novo fluxo modular (pasta `data/contributions/`)
- Execute o validador antes de submeter questões
- Siga os templates fornecidos para manter consistência

## 📋 Checklist para PRs de Questões

- [ ] Usei o template correto (`_TEMPLATE.json` ou `_TEMPLATE_MULTIPLE_ANSWER.json`)
- [ ] Executei o validador e corrigi todos os erros
- [ ] Preenchi as informações do contribuidor
- [ ] Adicionei referência para documentação oficial AWS
- [ ] Testei a questão localmente (se possível)
- [ ] Criei apenas 1 arquivo por PR (ou no máximo 3 questões relacionadas)