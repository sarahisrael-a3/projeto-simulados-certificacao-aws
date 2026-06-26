/**
 * Testes Unitários para StorageManager
 * Framework: Jest
 */

import { StorageManager } from '../src/frontend/js/storageManager.js';

describe('StorageManager - Persistência de Dados', () => {
    let storage;

    // Antes de CADA teste, limpamos o localStorage do ambiente de testes (JSDOM)
    // e criamos uma nova instância do StorageManager com um prefixo de teste.
    beforeEach(() => {
        localStorage.clear();
        storage = new StorageManager('test_aws_sim_');
    });

    test('Deve salvar e carregar o último resultado do quiz corretamente', () => {
        const mockResult = {
            certId: 'clf-c02',
            score: 45,
            total: 65,
            percentage: 69.23,
            passed: false,
            domainScores: { 'cloud-concepts': { total: 15, correct: 10 } },
            weakDomains: ['cloud-concepts'],
            answers: []
        };

        // Salva o resultado
        const saved = storage.saveQuizResult(mockResult);
        expect(saved).toBe(true);

        // Carrega o resultado parcial
        const lastScore = storage.loadLastScore('clf-c02');
        expect(lastScore).not.toBeNull();
        expect(lastScore.score).toBe(45);
        expect(lastScore.percentage).toBe(69.23);
        expect(lastScore.passed).toBe(false);

        // Carrega o resultado completo
        const fullResult = storage.loadLastResult('clf-c02');
        expect(fullResult.certId).toBe('clf-c02');
        // Verifica se a data foi gerada automaticamente pelo método saveQuizResult
        expect(fullResult.date).toBeDefined(); 
    });

    test('Deve adicionar resultados ao histórico mantendo a ordem (mais recente primeiro)', () => {
        storage.saveQuizResult({ certId: 'clf-c02', score: 10 });
        storage.saveQuizResult({ certId: 'saa-c03', score: 20 });

        const history = storage.getHistory();
        
        expect(history.length).toBe(2);
        // O último a ser salvo deve ser o primeiro da lista (unshift)
        expect(history[0].certId).toBe('saa-c03');
        expect(history[1].certId).toBe('clf-c02');
    });

    test('Deve ignorar salvamento duplicado da mesma tentativa', () => {
        const result = {
            attemptId: 'attempt-duplicado',
            certId: 'clf-c02',
            score: 9,
            total: 10,
            percentage: 90,
            passed: true,
            domainScores: { compute: { total: 10, correct: 9 } },
            answers: [{ id: 'q1', userSelection: 0, isCorrect: true }],
        };

        expect(storage.saveQuizResult(result)).toBe(true);
        expect(storage.saveQuizResult(result)).toBe(false);

        const history = storage.getHistory();
        expect(history).toHaveLength(1);
        expect(history[0].attemptId).toBe('attempt-duplicado');
    });

    test('Deve calcular progresso por certificacao a partir de sessoes concluidas unicas', () => {
        storage.saveQuizResult({
            attemptId: 'attempt-1',
            certId: 'clf-c02',
            score: 8,
            total: 10,
            percentage: 80,
        });
        storage.saveQuizResult({
            attemptId: 'attempt-1',
            certId: 'clf-c02',
            score: 8,
            total: 10,
            percentage: 80,
        });
        storage.saveQuizResult({
            attemptId: 'attempt-2',
            certId: 'saa-c03',
            score: 7,
            total: 10,
            percentage: 70,
        });

        expect(storage.getProgressFromHistory('clf-c02', 5)).toEqual({
            completedCount: 1,
            percentage: 20,
        });
    });

    test('getGamification deve derivar badges e totais do historico existente', () => {
        storage.saveQuizResult({
            attemptId: 'attempt-perfect',
            certId: 'clf-c02',
            score: 10,
            total: 10,
            percentage: 100,
            date: '2026-06-25T10:00:00.000Z',
        });

        const gamification = storage.getGamification();

        expect(gamification.totalQuizzes).toBe(1);
        expect(gamification.bestScore).toBe(100);
        expect(gamification.currentStreak).toBe(1);
        expect(gamification.badges).toContain('perfect');
    });

    test('updateGamification deve atualizar streak e conceder badge "perfect" para 100%', () => {
        // Primeiro quiz com 100%
        const gamification = storage.updateGamification(100);

        expect(gamification.totalQuizzes).toBe(1);
        expect(gamification.bestScore).toBe(100);
        expect(gamification.currentStreak).toBe(1);
        expect(gamification.badges).toContain('perfect'); // Ganhou a medalha
    });

    test('updateGamification deve zerar o streak se a nota for menor que 70%', () => {
        storage.updateGamification(80); // Streak = 1
        const failedGamification = storage.updateGamification(50); // Nota ruim!

        expect(failedGamification.currentStreak).toBe(0); // Perdeu o streak
    });

    test('clearAll deve remover APENAS as chaves com o prefixo do simulador', () => {
        // Salvamos algo com o nosso storage
        storage.saveQuizResult({ certId: 'clf-c02', score: 100 });
        
        // Simulamos o usuário salvando algo de OUTRO site/app no mesmo navegador
        localStorage.setItem('outra_chave_qualquer', 'nao-apague-isso');

        // Limpamos tudo do nosso simulador
        storage.clearAll();

        // Verificamos
        const nossoDado = localStorage.getItem('test_aws_sim_last_clf-c02');
        const dadoDoUsuario = localStorage.getItem('outra_chave_qualquer');

        expect(nossoDado).toBeNull(); // Nosso dado foi apagado
        expect(dadoDoUsuario).toBe('nao-apague-isso'); // Dado externo ficou intacto
    });

    test('exportData e importData devem funcionar perfeitamente para backup', () => {
        storage.saveQuizResult({ certId: 'clf-c02', score: 50 });
        
        // Exporta o backup
        const backup = storage.exportData();
        
        // Limpa tudo (simulando mudança de navegador)
        storage.clearAll();
        expect(storage.loadLastResult('clf-c02')).toBeNull();

        // Importa o backup
        const imported = storage.importData(backup);
        expect(imported).toBe(true);

        // Verifica se os dados voltaram
        const restoredResult = storage.loadLastResult('clf-c02');
        expect(restoredResult.score).toBe(50);
    });
});
