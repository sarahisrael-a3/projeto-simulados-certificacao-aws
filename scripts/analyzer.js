const fs = require('fs');
const path = require('path');

const EXAMES = ['clf-c02', 'saa-c03', 'aif-c01'];

EXAMES.forEach(exame => {
    const caminho = path.join(__dirname, '../data', `${exame}.json`);
    if (!fs.existsSync(caminho)) return;

    const banco = JSON.parse(fs.readFileSync(caminho, 'utf-8'));
    const stats = { total: banco.length, domains: {}, services: {}, types: {} };

    banco.forEach(q => {
        stats.domains[q.domain] = (stats.domains[q.domain] || 0) + 1;
        stats.services[q.service] = (stats.services[q.service] || 0) + 1;
        stats.types[q.type] = (stats.types[q.type] || 0) + 1;
    });

    console.log(`\n📊 RELATÓRIO: ${exame.toUpperCase()}`);
    console.log(`Total de Questões: ${stats.total}`);
    console.log(`Cobertura de Serviços: ${Object.keys(stats.services).length} serviços únicos`);
    console.table(stats.domains);
});