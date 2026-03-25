import { glossaryTerms } from './data.js';

// Movemos o estado específico dos flashcards para cá!
let flashcardState = {
    index: 0,
    flipped: false,
    filteredTerms: [],
    currentFilter: 'all'
};

// Recebe a função showScreen do app.js para poder mudar a tela
export function startFlashcards(showScreenFn) {
    // VALIDAÇÃO: Verifica se glossaryTerms existe e é um array válido
    if (!glossaryTerms || !Array.isArray(glossaryTerms) || glossaryTerms.length === 0) {
        alert('Nenhum termo disponível no glossário.');
        return;
    }
    
    flashcardState.index = 0;
    flashcardState.flipped = false;
    flashcardState.currentFilter = 'general'; // Inicia com Termos Gerais
    // Filtra apenas termos gerais (cert === 'all')
    flashcardState.filteredTerms = glossaryTerms.filter(term => term.cert === 'all');
    
    // VALIDAÇÃO: Verifica se showScreenFn é uma função
    if (typeof showScreenFn === 'function') {
        showScreenFn('flashcards');
    }
    
    renderCertificationFilter();
    loadFlashcard();
}

// Nova função para renderizar filtro de certificação
function renderCertificationFilter() {
    const filterContainer = document.getElementById('flashcard-filter');
    if (!filterContainer) return;
    
    // Conta termos por categoria
    const counts = {
        all: glossaryTerms.length,
        general: glossaryTerms.filter(t => t.cert === 'all').length,
        'clf-c02': glossaryTerms.filter(t => t.cert === 'clf-c02').length,
        'saa-c03': glossaryTerms.filter(t => t.cert === 'saa-c03').length,
        'dva-c02': glossaryTerms.filter(t => t.cert === 'dva-c02').length,
        'aif-c01': glossaryTerms.filter(t => t.cert === 'aif-c01').length
    };
    
    const certifications = [
        { id: 'all', name: 'Todos', icon: '📚', count: counts.all },
        { id: 'general', name: 'Termos Gerais', icon: '🌐', count: counts.general },
        { id: 'clf-c02', name: 'Cloud Practitioner', icon: '☁️', count: counts['clf-c02'] },
        { id: 'saa-c03', name: 'Solutions Architect', icon: '🏗️', count: counts['saa-c03'] },
        { id: 'dva-c02', name: 'Developer', icon: '💻', count: counts['dva-c02'] },
        { id: 'aif-c01', name: 'AI Practitioner', icon: '🤖', count: counts['aif-c01'] }
    ];
    
    filterContainer.innerHTML = certifications.map(cert => `
        <button 
            class="px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                flashcardState.currentFilter === cert.id 
                    ? 'bg-aws-orange text-white shadow-md' 
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600'
            }"
            onclick="window.filterFlashcardsByCert('${cert.id}')"
            title="${cert.name} (${cert.count} termos)"
        >
            <span class="mr-1">${cert.icon}</span>
            <span class="hidden sm:inline">${cert.name}</span>
            <span class="inline sm:hidden">${cert.name.split(' ')[0]}</span>
            <span class="ml-1 text-xs opacity-75">(${cert.count})</span>
        </button>
    `).join('');
}

// Nova função para filtrar flashcards por certificação
export function filterFlashcardsByCert(certId) {
    flashcardState.currentFilter = certId;
    
    if (certId === 'all') {
        // Mostra todos os termos
        flashcardState.filteredTerms = glossaryTerms;
    } else if (certId === 'general') {
        // Mostra APENAS termos gerais (aplicáveis a todas certificações)
        flashcardState.filteredTerms = glossaryTerms.filter(term => term.cert === 'all');
    } else {
        // Mostra APENAS termos específicos da certificação (SEM os gerais)
        flashcardState.filteredTerms = glossaryTerms.filter(term => term.cert === certId);
    }
    
    flashcardState.index = 0;
    flashcardState.flipped = false;
    
    renderCertificationFilter();
    loadFlashcard();
}

export function loadFlashcard() {
    // VALIDAÇÃO: Verifica se filteredTerms existe e é válido
    const terms = flashcardState.filteredTerms || glossaryTerms;
    
    if (!terms || !Array.isArray(terms) || terms.length === 0) {
        alert('Nenhum termo disponível para esta certificação.');
        return;
    }
    
    // VALIDAÇÃO: Verifica se o índice está dentro dos limites
    if (flashcardState.index < 0 || flashcardState.index >= terms.length) {
        console.warn('Índice de flashcard inválido. Resetando para 0.');
        flashcardState.index = 0;
    }
    
    const card = terms[flashcardState.index];
    
    // VALIDAÇÃO: Verifica se o card existe e tem as propriedades necessárias
    if (!card || !card.term || !card.definition) {
        console.error('Flashcard inválido no índice:', flashcardState.index);
        return;
    }
    
    // VALIDAÇÃO DOM: Verifica se elementos existem antes de manipular
    const termEl = document.getElementById('flashcard-term');
    const definitionEl = document.getElementById('flashcard-definition');
    const counterEl = document.getElementById('flashcard-counter');
    const cardContainer = document.getElementById('flashcard-container');
    
    if (termEl) termEl.textContent = card.term;
    if (definitionEl) definitionEl.textContent = card.definition;
    if (counterEl) counterEl.textContent = `${flashcardState.index + 1} / ${terms.length}`;
    
    if (cardContainer) {
        cardContainer.classList.remove('flipped');
        flashcardState.flipped = false;
    }
    
    updateFlashcardButtons();
}

export function flipFlashcard() {
    const cardContainer = document.getElementById('flashcard-container');
    if (cardContainer) {
        cardContainer.classList.toggle('flipped');
        flashcardState.flipped = !flashcardState.flipped;
    }
}

export function nextFlashcard() {
    const terms = flashcardState.filteredTerms || glossaryTerms;
    
    // VALIDAÇÃO: Verifica se terms existe
    if (!terms || !Array.isArray(terms)) {
        console.warn('Termos não disponíveis em nextFlashcard');
        return;
    }
    
    if (flashcardState.index < terms.length - 1) {
        flashcardState.index++;
        loadFlashcard();
    }
}

export function prevFlashcard() {
    if (flashcardState.index > 0) {
        flashcardState.index--;
        loadFlashcard();
    }
}

function updateFlashcardButtons() {
    const terms = flashcardState.filteredTerms || glossaryTerms;
    
    // VALIDAÇÃO: Verifica se terms existe
    if (!terms || !Array.isArray(terms)) {
        console.warn('Termos não disponíveis em updateFlashcardButtons');
        return;
    }
    
    // VALIDAÇÃO DOM: Verifica se elementos existem
    const prevBtn = document.getElementById('btn-prev-flashcard');
    const nextBtn = document.getElementById('btn-next-flashcard');
    
    if (prevBtn) {
        prevBtn.disabled = flashcardState.index === 0;
        prevBtn.classList.toggle('opacity-50', flashcardState.index === 0);
        prevBtn.classList.toggle('cursor-not-allowed', flashcardState.index === 0);
    }
    
    if (nextBtn) {
        nextBtn.disabled = flashcardState.index === terms.length - 1;
        nextBtn.classList.toggle('opacity-50', flashcardState.index === terms.length - 1);
        nextBtn.classList.toggle('cursor-not-allowed', flashcardState.index === terms.length - 1);
    }
}