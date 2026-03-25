# 📚 Guia Completo - AWS Certification Study Tool

> Documentação consolidada para usuários e desenvolvedores

## 📖 Índice

1. [Início Rápido](#início-rápido)
2. [Funcionalidades](#funcionalidades)
3. [Contribuindo com Questões](#contribuindo-com-questões)
4. [Geração de Questões com IA](#geração-de-questões-com-ia)
5. [Resolução de Problemas](#resolução-de-problemas)

---

## 🚀 Início Rápido

### Usar Online (Recomendado)

1. Acesse: https://karlarenatadev.github.io/projeto-simulados-certificacao-aws/
2. Selecione uma certificação (CLF-C02, SAA-C03, AIF-C01, DVA-C02)
3. Configure filtros (quantidade, dificuldade, modo)
4. Clique em "Iniciar Simulação"

### Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/karlarenatadev/projeto-simulados-certificacao-aws.git
cd projeto-simulados-certificacao-aws

# Inicie um servidor local
python -m http.server 8000
# OU
npx http-server -p 8000

# Acesse no navegador
http://localhost:8000
```

---

## ✨ Funcionalidades

### 🎓 Simulador de Exames

**Modo Exame**
- Timer baseado nos exames reais AWS
- Pontuação de 100-1000 (escala oficial)
- Feedback visual (verde/vermelho)
- Relatório detalhado por domínio

**Modo Revisão**
- Sem pressão de tempo
- Ideal para aprendizado profundo
- Explicações detalhadas

**Filtros Disponíveis**
- Quantidade: 5, 10, 15, 20, 30, 65 questões
- Dificuldade: Iniciante, Intermediário, Especialista
- Tópico: Filtro por domínio específico

### 📚 Modo Flashcards

- 96 termos AWS essenciais
- Efeito flip 3D interativo
- Filtro por certificação
- Navegação anterior/próximo

### 📊 Análise de Desempenho

- Gráfico de radar por domínio
- Dashboard global com histórico
- 11 tipos de insights inteligentes
- Recomendações personalizadas
- Exportação para PDF

### 🌐 Bilíngue

- Português (PT-BR)
- Inglês (EN-US)
- Alternância instantânea

### 💾 PWA Completo

- Instalável em desktop e mobile
- Funciona 100% offline
- Sincronização automática

---

## 🤝 Contribuindo com Questões

### Novo Fluxo Modular (Zero Conflitos)

#### 1. Copie o Template

```bash
# Questão de escolha única
cp data/contributions/_TEMPLATE.json \
   data/contributions/clf-c02/sua-questao.json

# Questão de múltipla resposta
cp data/contributions/_TEMPLATE_MULTIPLE_ANSWER.json \
   data/contributions/clf-c02/sua-questao-multipla.json
```

#### 2. Preencha sua Questão

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

#### 3. Valide

```bash
python scripts_python/validate_contribution.py \
  data/contributions/clf-c02/sua-questao.json
```

#### 4. Faça o Pull Request

```bash
git add data/contributions/clf-c02/sua-questao.json
git commit -m "feat(clf-c02): adiciona questão sobre versionamento S3"
git push origin feature/sua-questao
```

### Boas Práticas

✅ **Faça**
- Contextualize com cenários reais
- Seja específico e claro
- Explique todas as opções
- Adicione referências oficiais
- Use tags relevantes

❌ **Não Faça**
- Copiar de dumps ou sites pagos
- Criar questões ambíguas
- Usar informações desatualizadas
- Editar arquivos principais

---

## 🤖 Geração de Questões com IA

### Configuração Inicial

```bash
# 1. Instale dependências
pip install -r scripts_python/requirements.txt

# 2. Configure API Key do Google Gemini
echo "GEMINI_API_KEY=sua_chave_aqui" > .env

# Obter chave: https://aistudio.google.com/app/apikey
```

### Gerar Questões

#### Balanceamento Automático (Recomendado)

```bash
# Analisa e balanceia automaticamente
python scripts_python/auto_generate_questions.py clf-c02

# Todas as certificações
python scripts_python/auto_generate_questions.py all
```

#### Geração Rápida

```bash
# Sintaxe: quick_generate.py <cert> <difficulty> <quantity>
python scripts_python/quick_generate.py clf-c02 easy 10
python scripts_python/quick_generate.py saa-c03 hard 5
```

### Tradução

```bash
# Traduzir uma certificação
python scripts_python/translate_with_api.py clf-c02

# Traduzir todas
python scripts_python/translate_with_api.py all
```

### Distribuição Ideal

| Certificação | Fácil | Médio | Difícil | Total |
|--------------|-------|-------|---------|-------|
| CLF-C02 | 60 | 70 | 60 | 190 |
| SAA-C03 | 60 | 64 | 60 | 184 |
| DVA-C02 | 30 | 40 | 30 | 100 |
| AIF-C01 | 40 | 50 | 28 | 118 |

---

## 🔧 Resolução de Problemas

### Botões não funcionam

**Causa**: Erro de importação nos módulos ES6

**Solução**: Verifique o console do navegador
```javascript
// Deve ver no console:
// "PWA Service Worker registado com sucesso!"

// Se ver erros de importação:
// 1. Limpe o cache do navegador
// 2. Recarregue com Ctrl+Shift+R
```

### Filtro de dificuldade vazio

**Causa**: Certificação não tem questões naquele nível

**Solução**: O sistema desabilita automaticamente níveis vazios
- CLF-C02: Apenas "Intermediário"
- SAA-C03: Todos os níveis
- DVA-C02: Todos os níveis (poucos)
- AIF-C01: Apenas "Intermediário"

### Erro ao gerar questões

**Problema**: `GEMINI_API_KEY não encontrada`
```bash
# Crie o arquivo .env na raiz
echo "GEMINI_API_KEY=sua_chave_aqui" > .env
```

**Problema**: `RESOURCE_EXHAUSTED` ou `429`
- Aguarde 30-60 segundos
- O script tem retry automático
- Limite: 15 requisições/minuto (free tier)

### JSON corrompido

```bash
# Validar JSON
python -m json.tool data/clf-c02.json > /dev/null && echo "✅ JSON válido"

# Restaurar backup
cp data/backups/clf-c02_backup_pt.json data/clf-c02.json
```

### PWA não instala

1. Verifique se está usando HTTPS ou localhost
2. Limpe o cache do navegador
3. Verifique se `manifest.json` está acessível
4. Veja o console para erros do Service Worker

---

## 📊 Comandos Úteis

### Verificar Distribuição

```bash
python -c "
import json
from collections import Counter

cert_id = 'clf-c02'
data = json.load(open(f'data/{cert_id}.json'))
dist = Counter(q['difficulty'] for q in data)

print(f'📊 {cert_id.upper()}')
print(f'   Fácil:        {dist.get(\"easy\", 0)}')
print(f'   Intermediário: {dist.get(\"medium\", 0)}')
print(f'   Difícil:      {dist.get(\"hard\", 0)}')
print(f'   Total:        {len(data)}')
"
```

### Fazer Backup

```bash
# Com timestamp
cp data/clf-c02.json data/backups/clf-c02_backup_$(date +%Y%m%d_%H%M%S).json
```

### Validar Todos os JSONs

```bash
for cert in clf-c02 saa-c03 dva-c02 aif-c01; do
    python -m json.tool data/${cert}.json > /dev/null && echo "✅ ${cert}.json válido"
done
```

---

## 🎯 Casos de Uso

### Estudante Iniciante

1. Comece com CLF-C02
2. Use filtro "Intermediário" (único disponível)
3. Faça simulados de 10 questões
4. Revise flashcards após cada simulado
5. Aumente para 20-30 questões gradualmente

### Estudante Avançado

1. Escolha SAA-C03 ou DVA-C02
2. Use filtro "Todas" as dificuldades
3. Faça simulados de 65 questões (exame completo)
4. Modo Exame com timer
5. Analise relatório detalhado por domínio

### Desenvolvedor do Projeto

1. Gere questões: `auto_generate_questions.py`
2. Valide: `sanity_check.py`
3. Traduza: `translate_with_api.py`
4. Teste no navegador
5. Commit e push

---

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/karlarenatadev/projeto-simulados-certificacao-aws/issues)
- **Discussões**: [GitHub Discussions](https://github.com/karlarenatadev/projeto-simulados-certificacao-aws/discussions)
- **LinkedIn**: [Karla Renata](https://www.linkedin.com/in/karlarenata-rosario/)

---

## 📝 Licença

Este projeto é código aberto para fins educacionais e de portfólio técnico.

---

<div align="center">

**Construído com ❤️ pela Guilda | Aprendizado Colaborativo em Cloud Computing**

⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!

</div>
