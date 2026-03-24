# 🚀 Guia Rápido de Contribuição (5 minutos)

## 📝 Contribuir com Questões

### 1️⃣ Copie o Template

```bash
cp data/contributions/_TEMPLATE.json \
   data/contributions/clf-c02/questao-s3-versionamento.json
```

### 2️⃣ Preencha sua Questão

```json
{
  "domain": "tecnologia",
  "subdomain": "armazenamento",
  "service": "Amazon S3",
  "difficulty": "medium",
  "type": "multiple-choice",
  "tags": ["s3", "versionamento"],
  "question": "Sua pergunta aqui...",
  "options": ["A", "B", "C", "D"],
  "correct": 0,
  "explanation": "Explicação detalhada...",
  "reference": "https://docs.aws.amazon.com/...",
  "contributor": {
    "name": "Seu Nome",
    "github": "seu-usuario",
    "date": "2026-03-24"
  }
}
```

### 3️⃣ Valide

```bash
python scripts_python/validate_contribution.py \
  data/contributions/clf-c02/questao-s3-versionamento.json
```

### 4️⃣ Commit e Push

```bash
git add data/contributions/clf-c02/questao-s3-versionamento.json
git commit -m "feat(clf-c02): adiciona questão sobre versionamento S3"
git push
```

### 5️⃣ Abra Pull Request

- Vá para seu fork no GitHub
- Clique em "Compare & pull request"
- Preencha o template
- Aguarde validação automática ✅

---

## ✅ O que acontece depois?

1. **Validação Automática** (2 min)
   - GitHub Actions valida sua questão
   - Comenta no PR com resultados

2. **Review Manual** (1-2 dias)
   - Mantenedor revisa qualidade
   - Aprova ou solicita mudanças

3. **Merge** (imediato após aprovação)
   - PR mergeado na branch main

4. **Auto-Merge** (semanal)
   - Mantenedor executa workflow
   - Sua questão vai para o banco principal

---

## 🚫 O que NÃO fazer

- ❌ Não edite `clf-c02.json` diretamente
- ❌ Não edite `saa-c03.json` diretamente
- ❌ Não edite `aif-c01.json` diretamente
- ❌ Não edite `dva-c02.json` diretamente

**Use sempre o sistema modular!**

---

## 📚 Documentação Completa

- [Guia Completo de Contribuição](../docs/guia-contribuicao-questoes.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [CI/CD Setup](../docs/ci-cd-setup.md)

---

## 💬 Precisa de Ajuda?

- 🐛 [Reportar Bug](https://github.com/karlarenatadev/projeto-simulados-certificacao-aws/issues/new?template=bug-report.md)
- 💡 [Propor Questão](https://github.com/karlarenatadev/projeto-simulados-certificacao-aws/issues/new?template=nova-questao.md)
- 💬 [Discussões](https://github.com/karlarenatadev/projeto-simulados-certificacao-aws/discussions)

---

<div align="center">

**Obrigado por contribuir! 🎉**

*Juntos, democratizamos o acesso a materiais de estudo de qualidade.*

</div>
