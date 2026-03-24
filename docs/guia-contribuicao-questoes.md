# 📝 Guia Completo: Como Contribuir com Questões

Este guia explica o **novo fluxo modular** de contribuição de questões que elimina conflitos de merge no Git.

## 🎯 Por que mudamos?

### Problema Antigo
```
❌ 10 pessoas editam clf-c02.json ao mesmo tempo
❌ Conflitos de merge massivos
❌ PRs bloqueados esperando merge
❌ Perda de tempo resolvendo conflitos
```

### Solução Nova
```
✅ Cada pessoa cria 1 arquivo individual
✅ Zero conflitos de merge
✅ PRs independentes e rápidos
✅ Merge automático via script
```

---

## 🚀 Fluxo Completo (5 minutos)

### 1. Fork e Clone

```bash
# Fork no GitHub (botão "Fork")
# Clone seu fork
git clone https://github.com/SEU-USUARIO/projeto-simulados-certificacao-aws.git
cd projeto-simulados-certificacao-aws
```

### 2. Crie uma Branch

```bash
git checkout -b feature/questao-s3-versionamento
```

### 3. Copie o Template

```bash
# Para questão de escolha única
cp data/contributions/_TEMPLATE.json \
   data/contributions/clf-c02/questao-s3-versionamento.json

# Para questão de múltipla resposta
cp data/contributions/_TEMPLATE_MULTIPLE_ANSWER.json \
   data/contributions/clf-c02/questao-ec2-tipos-instancia.json
```

### 4. Preencha sua Questão

Edite o arquivo JSON:

```json
{
  "domain": "tecnologia",
  "subdomain": "armazenamento",
  "service": "Amazon S3",
  "difficulty": "medium",
  "type": "multiple-choice",
  "tags": ["s3", "versionamento", "backup", "durabilidade"],
  "question": "Uma empresa de e-commerce armazena imagens de produtos no Amazon S3 e precisa proteger esses dados contra exclusões acidentais causadas por erros humanos ou bugs em aplicações. A empresa quer uma solução nativa do S3 que mantenha versões anteriores dos objetos sem precisar implementar backups manuais. Qual recurso do Amazon S3 deve ser habilitado para atender a esse requisito?",
  "options": [
    "Versionamento de objetos (Object Versioning)",
    "Replicação entre regiões (Cross-Region Replication)",
    "Bloqueio de objetos (Object Lock)",
    "Políticas de ciclo de vida (Lifecycle Policies)"
  ],
  "correct": 0,
  "explanation": "O Versionamento de objetos do S3 mantém múltiplas versões de um objeto no mesmo bucket, permitindo recuperar versões anteriores em caso de exclusão acidental ou sobrescrita. A Replicação entre regiões é para disaster recovery, o Object Lock é para conformidade regulatória (WORM), e as Lifecycle Policies são para transição automática entre classes de armazenamento.",
  "reference": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html",
  "contributor": {
    "name": "João Silva",
    "github": "joaosilva",
    "date": "2026-03-24"
  }
}
```

### 5. Valide sua Questão

```bash
# Instale dependências (primeira vez)
pip install -r scripts_python/requirements.txt

# Execute o validador
python scripts_python/validate_contribution.py \
  data/contributions/clf-c02/questao-s3-versionamento.json
```

**Saída esperada:**
```
🔍 Validando: questao-s3-versionamento.json
============================================================

✅ VALIDAÇÃO PASSOU!
   Sua questão está pronta para ser submetida via Pull Request!
```

### 6. Commit e Push

```bash
git add data/contributions/clf-c02/questao-s3-versionamento.json
git commit -m "feat(clf-c02): adiciona questão sobre versionamento S3"
git push origin feature/questao-s3-versionamento
```

### 7. Abra o Pull Request

1. Vá para seu fork no GitHub
2. Clique em "Compare & pull request"
3. Preencha o template do PR
4. Aguarde review dos mantenedores

---

## 📋 Estrutura de Pastas

```
data/
├── contributions/              # 👈 NOVA PASTA MODULAR
│   ├── README.md              # Guia rápido
│   ├── _TEMPLATE.json         # Template escolha única
│   ├── _TEMPLATE_MULTIPLE_ANSWER.json  # Template múltipla resposta
│   │
│   ├── clf-c02/               # Cloud Practitioner
│   │   ├── questao-s3-versionamento.json
│   │   ├── questao-iam-politicas.json
│   │   └── questao-ec2-tipos.json
│   │
│   ├── saa-c03/               # Solutions Architect
│   │   ├── questao-vpc-subnets.json
│   │   └── questao-rds-multi-az.json
│   │
│   ├── aif-c01/               # AI Practitioner
│   │   └── questao-sagemaker-endpoints.json
│   │
│   └── dva-c02/               # Developer
│       └── questao-lambda-layers.json
│
├── clf-c02.json               # ❌ NÃO EDITE MAIS!
├── saa-c03.json               # ❌ NÃO EDITE MAIS!
├── aif-c01.json               # ❌ NÃO EDITE MAIS!
└── dva-c02.json               # ❌ NÃO EDITE MAIS!
```

---

## 🔍 Validações Automáticas

O validador verifica:

### ✅ Estrutura
- Todos os campos obrigatórios presentes
- Tipos de dados corretos (string, array, number)
- JSON válido e bem formatado

### ✅ Conteúdo
- Domínio válido para a certificação
- Dificuldade: `easy`, `medium` ou `hard`
- Tipo: `multiple-choice` ou `multiple-answer`
- Exatamente 4 opções de resposta
- Resposta correta dentro do range válido
- Tags relevantes (mínimo 2)

### ✅ Qualidade
- Questão com pelo menos 50 caracteres
- Explicação detalhada (mínimo 50 caracteres)
- Referência para documentação oficial
- Informações do contribuidor completas

### ⚠️ Avisos (não bloqueiam)
- Questão muito curta ou muito longa
- Poucas tags
- Questão não termina com "?"
- Opções muito curtas

---

## 🎨 Boas Práticas

### ✅ Faça

- **Contextualize**: Descreva um cenário real de uso
- **Seja específico**: Evite questões genéricas
- **Explique bem**: Justifique por que cada opção está certa ou errada
- **Adicione referências**: Link para docs oficiais AWS
- **Use tags relevantes**: Facilita busca e filtros futuros
- **Teste localmente**: Valide antes de submeter

### ❌ Não Faça

- Copiar questões de dumps ou sites pagos
- Criar questões ambíguas ou com múltiplas respostas corretas
- Usar informações desatualizadas
- Submeter sem validar
- Editar arquivos principais (`clf-c02.json`, etc.)

---

## 🔄 Como Funciona o Merge?

### Para Contribuidores

Você só precisa:
1. Criar seu arquivo individual
2. Validar
3. Fazer PR

### Para Mantenedores

Periodicamente, executamos:

```bash
# Mergeia todas as contribuições validadas
python scripts_python/merge_contributions.py clf-c02

# Ou em modo dry-run (teste sem alterar arquivos)
python scripts_python/merge_contributions.py clf-c02 --dry-run
```

**O que o script faz:**
1. ✅ Valida cada contribuição
2. ✅ Detecta duplicatas
3. ✅ Adiciona ao arquivo principal
4. ✅ Move contribuições processadas para `_processed/`
5. ✅ Cria backup automático

---

## 📊 Exemplo Completo: Questão de Múltipla Resposta

```json
{
  "domain": "seguranca",
  "subdomain": "protecao-de-dados",
  "service": "Amazon S3",
  "difficulty": "hard",
  "type": "multiple-answer",
  "tags": ["s3", "seguranca", "criptografia", "acesso"],
  "question": "Uma empresa de saúde precisa armazenar dados sensíveis de pacientes no Amazon S3 em conformidade com HIPAA. Quais das seguintes práticas de segurança devem ser implementadas? (Escolha 2)",
  "options": [
    "Habilitar criptografia no lado do servidor (SSE-S3 ou SSE-KMS)",
    "Tornar todos os buckets públicos para facilitar acesso",
    "Habilitar versionamento para proteger contra exclusões acidentais",
    "Desabilitar todas as políticas de bucket para simplificar gestão"
  ],
  "correct": [0, 2],
  "explanation": "Para conformidade com HIPAA, é essencial habilitar criptografia (opção A) para proteger dados em repouso e versionamento (opção C) para proteger contra exclusões acidentais e manter auditoria. Tornar buckets públicos (opção B) e desabilitar políticas (opção D) são práticas inseguras que violam requisitos de conformidade.",
  "reference": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html",
  "contributor": {
    "name": "Maria Santos",
    "github": "mariasantos",
    "date": "2026-03-24"
  }
}
```

**Pontos importantes:**
- `"type": "multiple-answer"` indica múltipla resposta
- `"correct": [0, 2]` é um array de índices
- Questão indica claramente "(Escolha 2)"
- Explicação justifica todas as opções

---

## 🆘 Troubleshooting

### Erro: "JSON inválido"
```bash
# Use um validador JSON online
https://jsonlint.com/
```

### Erro: "Campo obrigatório faltando"
```bash
# Verifique se todos os campos do template estão presentes
# Compare com _TEMPLATE.json
```

### Erro: "Dificuldade inválida"
```bash
# Use apenas: "easy", "medium" ou "hard"
```

### Erro: "Tipo inválido"
```bash
# Use apenas: "multiple-choice" ou "multiple-answer"
```

### Aviso: "Questão muito curta"
```bash
# Adicione mais contexto ao cenário
# Mínimo recomendado: 50 caracteres
```

---

## 🎯 Próximos Passos

Depois de dominar o fluxo básico:

1. **Contribua com traduções**: Crie versões EN-US das questões
2. **Revise questões existentes**: Melhore explicações e referências
3. **Crie questões avançadas**: Foque em cenários complexos
4. **Ajude na documentação**: Melhore este guia

---

## 📞 Precisa de Ajuda?

- 💬 Abra uma [Issue](https://github.com/karlarenatadev/projeto-simulados-certificacao-aws/issues) com a label `question`
- 📖 Leia o [CONTRIBUTING.md](../CONTRIBUTING.md)
- 🤝 Participe das discussões no GitHub

---

<div align="center">

**Obrigado por contribuir com a Guilda! 🎉**

*Juntos, estamos democratizando o acesso a materiais de estudo de qualidade.*

</div>
