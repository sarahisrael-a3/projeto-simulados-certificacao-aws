require('dotenv').config();
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const stringSimilarity = require("string-similarity");

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// --- CONFIGURAÇÃO MASTER ---
const META_POR_NIVEL = 60;
const TENTATIVAS_MAXIMAS = 3; 
const ESPERA_ENTRE_BLOCOS = 20000; // 20 segundos para evitar erro 429 (Rate Limit)
const DIFICULDADES = ["easy", "medium", "hard"];

const DOMINIOS_VALIDOS = [
    "conceitos-cloud", "seguranca", "tecnologia", "faturamento",
    "design-resiliente", "design-performance", "seguranca-aplicacoes", "design-custo",
    "conceitos-ia", "ia-generativa", "seguranca-ia", "implementacao-ia"
];

const EXAMES = [
    { 
        id: "clf-c02", 
        nome: "AWS Certified Cloud Practitioner (CLF-C02)",
        dominios: ["conceitos-cloud", "seguranca", "tecnologia", "faturamento"]
    },
    { 
        id: "saa-c03", 
        nome: "AWS Certified Solutions Architect – Associate (SAA-C03)",
        dominios: ["design-resiliente", "design-performance", "seguranca-aplicacoes", "design-custo"]
    },
    { 
        id: "aif-c01", 
        nome: "AWS Certified AI Practitioner (AIF-C01)",
        dominios: ["conceitos-ia", "ia-generativa", "seguranca-ia", "implementacao-ia"]
    }
];

// ============================================================================
// FUNÇÕES DE VALIDAÇÃO
// ============================================================================

function validarEstrutura(q) {
    if (!q.domain || !q.difficulty || !q.question || !q.explanation) return false;
    if (!Array.isArray(q.options) || q.options.length !== 4) return false;
    if (typeof q.correct !== "number" || q.correct < 0 || q.correct > 3) return false;
    
    if (!DOMINIOS_VALIDOS.includes(q.domain)) return false;
    if (!DIFICULDADES.includes(q.difficulty)) return false;

    for (const opt of q.options) {
        if (opt.length < 3 || opt.length > 200) return false;
    }
    return true;
}

function validarQualidade(q) {
    if (q.question.length < 30 || q.explanation.length < 30) return false;
    const opcoesUnicas = new Set(q.options.map(o => o.toLowerCase().trim()));
    if (opcoesUnicas.size !== 4) return false;
    return true;
}

function isDuplicate(nova, banco) {
    if (!banco || banco.length === 0) return false;
    const novaPergunta = nova.question.toLowerCase().trim();

    for (const qExistente of banco) {
        const existente = qExistente.question.toLowerCase().trim();
        if (existente === novaPergunta) return true;

        const score = stringSimilarity.compareTwoStrings(novaPergunta, existente);
        if (score > 0.85) return true;
    }
    return false;
}

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

// ============================================================================
// MOTOR PRINCIPAL
// ============================================================================

async function iniciarAutomacao() {
    console.log("\n🚀 [MOTOR DE IA] Iniciando processo de abastecimento com VALIDADOR...");
    
    for (const exame of EXAMES) {
        console.log(`\n📂 EXAME: ${exame.nome.toUpperCase()}`);
        const caminho = path.join(__dirname, '../data', `${exame.id}.json`);
        
        const dirData = path.join(__dirname, '../data');
        if (!fs.existsSync(dirData)) {
            fs.mkdirSync(dirData, { recursive: true });
        }

        let banco = fs.existsSync(caminho) ? JSON.parse(fs.readFileSync(caminho, 'utf-8')) : [];

        for (const nivel of DIFICULDADES) {
            let atuais = banco.filter(q => q.difficulty === nivel).length;
            
            while (atuais < META_POR_NIVEL) {
                const faltam = META_POR_NIVEL - atuais;
                const lote = Math.min(10, faltam);

                console.log(`   [${nivel.toUpperCase()}] Status: ${atuais}/${META_POR_NIVEL} | Gerando +${lote}...`);
                
                let sucesso = false;
                let tentativas = 0;

                while (!sucesso && tentativas < TENTATIVAS_MAXIMAS) {
                    const loteIA = await pedirIA(exame, nivel, lote);
                    
                    if (loteIA && Array.isArray(loteIA)) {
                        // PIPELINE DE VALIDAÇÃO
                        const validas = loteIA.filter(q => {
                            const okEstrutura = validarEstrutura(q);
                            const okQualidade = validarQualidade(q);
                            const duplicada = isDuplicate(q, banco);

                            if (!okEstrutura) console.warn("      ⚠️ Descartada: Erro de estrutura/domínio.");
                            if (!okQualidade) console.warn("      ⚠️ Descartada: Baixa qualidade.");
                            if (duplicada) console.warn("      ⚠️ Descartada: Duplicada/Similar.");

                            return okEstrutura && okQualidade && !duplicada;
                        });

                        if (validas.length > 0) {
                            let ultimoId = banco.length > 0 ? Math.max(...banco.map(q => q.id)) : 1000;
                            
                            validas.forEach(q => { 
                                q.id = ++ultimoId; 
                                banco.push(q); 
                            });
                            
                            fs.writeFileSync(caminho, JSON.stringify(banco, null, 2));
                            atuais = banco.filter(q => q.difficulty === nivel).length;
                            sucesso = true;
                            console.log(`      ✅ Lote processado: ${validas.length} questões salvas.`);
                        } else {
                            console.warn("      🟠 Nenhuma questão válida no lote. Tentando novamente...");
                            tentativas++;
                        }
                    } else {
                        tentativas++;
                        await sleep(10000 * tentativas);
                    }
                }

                if (!sucesso) break;
                await sleep(ESPERA_ENTRE_BLOCOS);
            }
        }
    }
    console.log("\n🏆 [FINALIZADO] O banco de dados está completo e validado!");
}

async function pedirIA(exame, nivel, quantidade) {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            generationConfig: { 
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            domain: { type: SchemaType.STRING },
                            subdomain: { type: SchemaType.STRING }, 
                            service: { type: SchemaType.STRING },   
                            type: { type: SchemaType.STRING },      
                            tags: {                                 
                                type: SchemaType.ARRAY, 
                                items: { type: SchemaType.STRING } 
                            },
                            difficulty: { type: SchemaType.STRING },
                            question: { type: SchemaType.STRING },
                            options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                            correct: { type: SchemaType.INTEGER },
                            explanation: { type: SchemaType.STRING }
                        },
                        required: ["domain", "subdomain", "service", "type", "tags", "question", "options", "correct", "explanation"]
                    }
                }
            } 
        });

        const prompt = `Atue como Arquiteto AWS Sênior. Gere ${quantidade} questões de múltipla escolha INÉDITAS para o exame ${exame.nome}.
        Dificuldade: "${nivel}". Domínios permitidos: ${JSON.stringify(exame.dominios)}.
        Cenários técnicos e reais. Sem letras (A, B...) nas opções.
        
        Exemplo:
        [
          {
            "domain": "${exame.dominios[0]}",
            "difficulty": "${nivel}",
            "question": "Qual serviço AWS gerencia chaves de encriptação?",
            "options": ["AWS IAM", "AWS KMS", "AWS CloudTrail", "Amazon Inspector"],
            "correct": 1,
            "explanation": "O AWS KMS gerencia chaves de encriptação de forma segura."
          }
        ]`;

        const result = await model.generateContent(prompt);
        return JSON.parse(result.response.text());

    } catch (e) {
        console.error(`      ❌ Erro na IA: ${e.message}`);
        return null;
    }
}

iniciarAutomacao();