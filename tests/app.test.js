// Importa as funções do nosso app.js
const { shuffleArray, getWeakDomains, calculatePercentage } = require('../src/app.js');

describe('Testes das Funções Utilitárias', () => {

  // 1. Testando a calculatePercentage
  test('Deve calcular a porcentagem corretamente', () => {
    // Se acertei 7 de 10, tem que dar 70
    expect(calculatePercentage(7, 10)).toBe(70);
    
    // Se acertei 0, tem que dar 0
    expect(calculatePercentage(0, 10)).toBe(0);
    
    // Se o total for 0, tem que dar 0 (para não dar erro de divisão)
    expect(calculatePercentage(5, 0)).toBe(0);
  });

  // 2. Testando a getWeakDomains
  test('Deve identificar domínios com nota abaixo de 70%', () => {
    // Simulamos a nota do usuário em 3 áreas
    const pontuacoes = {
      'nuvem': { correct: 8, total: 10 },    // 80% (Passou)
      'seguranca': { correct: 5, total: 10 },// 50% (Fraco!)
      'banco': { correct: 9, total: 10 }     // 90% (Passou)
    };

    const dominiosFracos = getWeakDomains(pontuacoes);
    
    // Esperamos que ele avise que apenas 'seguranca' está fraco
    expect(dominiosFracos).toEqual(['seguranca']);
  });

  // 3. Testando a shuffleArray
  test('Deve embaralhar a lista sem perder nenhum item', () => {
    const listaOriginal = ['A', 'B', 'C', 'D'];
    const listaEmbaralhada = shuffleArray(listaOriginal);

    // O tamanho tem que continuar sendo 4
    expect(listaEmbaralhada.length).toBe(4);
    
    // Tem que conter as mesmas letras de antes
    expect(listaEmbaralhada).toContain('A');
    expect(listaEmbaralhada).toContain('B');
    expect(listaEmbaralhada).toContain('C');
    expect(listaEmbaralhada).toContain('D');
  });

});