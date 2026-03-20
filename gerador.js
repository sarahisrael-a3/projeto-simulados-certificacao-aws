require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// --- CONFIGURAÇÃO PRO ---
const META_POR_NIVEL = 60;
const TENTATIVAS_MAXIMAS = 3; // Se falhar, tenta de novo até 3 vezes
const ESPERA_ENTRE_BLOCOS = 7000; // 7 segundos (evita o erro 429)

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

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function iniciarAutomacao() {
    console.log("\n🛠️  INICIANDO MOTOR DE GERAÇÃO RESILIENTE...");
    
    for (const exame of EXAMES) {
        console.log(`\n📂 EXAME: ${exame.nome.toUpperCase()}`);
        const caminho = path.join(__dirname, 'data', `${exame.id}.json`);
        let banco = fs.existsSync(caminho) ? JSON.parse(fs.readFileSync(caminho, 'utf-8')) : [];

        for (const nivel of ["easy", "medium", "hard"]) {
            let atuais = banco.filter(q => q.difficulty === nivel).length;
            
            while (atuais < META_POR_NIVEL) {
                const faltam = META_POR_NIVEL - atuais;
                const lote = Math.min(15, faltam);

                console.log(`   [${nivel.toUpperCase()}] Progresso: ${atuais}/${META_POR_NIVEL} | Solicitando +${lote}...`);
                
                let sucesso = false;
                let tentativas = 0;

                while (!sucesso && tentativas < TENTATIVAS_MAXIMAS) {
                    const novas = await pedirIA(exame, nivel, lote);
                    
                    if (novas && novas.length > 0) {
                        let ultimoId = banco.length > 0 ? Math.max(...banco.map(q => q.id)) : 1000;
                        novas.forEach(q => { q.id = ++ultimoId; banco.push(q); });
                        
                        fs.writeFileSync(caminho, JSON.stringify(banco, null, 2));
                        atuais = banco.filter(q => q.difficulty === nivel).length;
                        sucesso = true;
                        console.log(`      ✅ Sucesso! (${novas.length} novas questões)`);
                    } else {
                        tentativas++;
                        const tempoEspera = 10000 * tentativas;
                        console.warn(`      ⚠️  Falha (Tentativa ${tentativas}/${TENTATIVAS_MAXIMAS}). Aguardando ${tempoEspera/1000}s...`);
                        await sleep(tempoEspera);
                    }
                }

                if (!sucesso) {
                    console.error(`      ❌ Abortando nível ${nivel} após várias falhas. Pulando para o próximo.`);
                    break;
                }

                await sleep(ESPERA_ENTRE_BLOCOS);
            }
        }
    }
    console.log("\n🏆 PROCESSO FINALIZADO COM SUCESSO!");
}

async function pedirIA(exame, nivel, quantidade) {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash", 
            generationConfig: { responseMimeType: "application/json" } 
        });

        const prompt = `Aja como Arquiteto AWS Sênior. Gere ${quantidade} questões de múltipla escolha INÉDITAS para o exame ${exame.nome}.
        Dificuldade: "${nivel}". Domínios: ${JSON.stringify(exame.dominios)}.
        As questões devem focar em cenários reais de empresas. Evite repetir perguntas anteriores.
        Responda APENAS com um array JSON válido:
        [{ "domain": "string", "difficulty": "${nivel}", "question": "string", "options": ["A", "B", "C", "D"], "correct": 0, "explanation": "string" }]`;

        const result = await model.generateContent(prompt);
        const data = JSON.parse(result.response.text());
        
        // Validação básica de Schema
        return Array.isArray(data) ? data : null;
    } catch (e) {
        return null;
    }
}

iniciarAutomacao();