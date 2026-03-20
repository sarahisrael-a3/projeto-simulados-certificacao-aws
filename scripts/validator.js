const stringSimilarity = require("string-similarity");

// Domínios mapeados conforme a configuração do seu gerador.js
const DOMINIOS_VALIDOS = [
  "conceitos-cloud", "seguranca", "tecnologia", "faturamento",
  "design-resiliente", "design-performance", "seguranca-aplicacoes", "design-custo",
  "conceitos-ia", "ia-generativa", "seguranca-ia", "implementacao-ia"
];

const DIFICULDADES_VALIDAS = ["easy", "medium", "hard"];

/**
 * 1️⃣ Validação estrutural e de integridade
 */
function validarEstrutura(q) {
  if (!q.domain || !q.difficulty || !q.question || !q.explanation) return false;
  if (!Array.isArray(q.options) || q.options.length !== 4) return false;
  if (typeof q.correct !== "number" || q.correct < 0 || q.correct > 3) return false;
  
  // Valida se o domínio e a dificuldade são permitidos
  if (!DOMINIOS_VALIDOS.includes(q.domain)) return false;
  if (!DIFICULDADES_VALIDAS.includes(q.difficulty)) return false;

  // Validação de tamanho das opções (Evita opções vazias ou gigantes)
  for (const opt of q.options) {
    if (opt.length < 3 || opt.length > 200) return false;
  }

  return true;
}

/**
 * 2️⃣ Validação de qualidade de conteúdo
 */
function validarQualidade(q) {
  // Garante que a pergunta e a explicação tenham substância
  if (q.question.length < 30 || q.explanation.length < 30) return false;

  // Garante que as 4 opções sejam diferentes entre si
  const opcoesUnicas = new Set(q.options.map(o => o.toLowerCase().trim()));
  if (opcoesUnicas.size !== 4) return false;

  return true;
}

/**
 * 3️⃣ Detector de duplicidade e similaridade semântica
 */
function isDuplicate(nova, banco) {
  if (!banco || banco.length === 0) return false;
  
  // Normalização fora do loop para performance
  const novaPergunta = nova.question.toLowerCase().trim();

  for (const qExistente of banco) {
    const existente = qExistente.question.toLowerCase().trim();

    // Comparação exata
    if (existente === novaPergunta) return true;

    // Comparação por similaridade (acima de 85% considera duplicada)
    const score = stringSimilarity.compareTwoStrings(novaPergunta, existente);
    if (score > 0.85) return true;
  }

  return false;
}

module.exports = { validarEstrutura, validarQualidade, isDuplicate };