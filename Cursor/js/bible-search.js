import { BIBLE_CONFIG } from './config.js';
import { showNotification } from './common.js';

class BibleSearch {
    constructor() {
        this.searchHistory = [];
        this.maxHistoryItems = 10;
        this.isInitialized = false;
    }

    initialize() {
        this.setupSearchUI();
        this.setupEventListeners();
        this.loadSearchHistory();
        this.isInitialized = true;
    }

    setupSearchUI() {
        const searchSection = document.querySelector('.bible-search');
        if (!searchSection) return;

        searchSection.innerHTML = `
            <div class="search-container">
                <div class="search-header">
                    <h3>Busca Avançada</h3>
                    <button class="btn btn-icon" id="toggleSearch" title="Alternar painel de busca">
                        <span class="material-icons">expand_more</span>
                    </button>
                </div>

                <div class="search-content">
                    <div class="search-input-container">
                        <input type="text" class="search-input" placeholder="Digite sua busca...">
                        <button class="btn btn-primary" id="performSearch">
                            <span class="material-icons">search</span>
                            Buscar
                        </button>
                    </div>

                    <div class="search-filters">
                        <div class="filter-group">
                            <label>Versão</label>
                            <select class="version-select">
                                ${BIBLE_CONFIG.versions.map(v => `
                                    <option value="${v.id}">${v.name}</option>
                                `).join('')}
                            </select>
                        </div>

                        <div class="filter-group">
                            <label>Testamento</label>
                            <select class="testament-select">
                                <option value="all">Todos</option>
                                <option value="old">Antigo Testamento</option>
                                <option value="new">Novo Testamento</option>
                            </select>
                        </div>

                        <div class="filter-group">
                            <label>Tipo de Busca</label>
                            <select class="search-type-select">
                                <option value="exact">Exata</option>
                                <option value="fuzzy">Aproximada</option>
                                <option value="regex">Expressão Regular</option>
                            </select>
                        </div>

                        <div class="filter-group">
                            <label>Ordenar por</label>
                            <select class="sort-select">
                                <option value="relevance">Relevância</option>
                                <option value="book">Livro</option>
                                <option value="chapter">Capítulo</option>
                                <option value="verse">Versículo</option>
                            </select>
                        </div>
                    </div>

                    <div class="search-options">
                        <label class="checkbox-label">
                            <input type="checkbox" class="case-sensitive">
                            Sensível a maiúsculas/minúsculas
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" class="whole-words">
                            Palavras inteiras
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" class="include-notes">
                            Incluir notas
                        </label>
                    </div>

                    <div class="search-history">
                        <div class="history-header">
                            <h4>Histórico de Buscas</h4>
                            <button class="btn btn-icon" id="clearHistory" title="Limpar histórico">
                                <span class="material-icons">delete</span>
                            </button>
                        </div>
                        <div class="history-list">
                            <!-- Histórico será carregado dinamicamente -->
                        </div>
                    </div>

                    <div class="search-results">
                        <div class="results-header">
                            <h4>Resultados</h4>
                            <span class="results-count">0 resultados</span>
                        </div>
                        <div class="results-list">
                            <!-- Resultados serão carregados dinamicamente -->
                        </div>
                        <div class="results-pagination">
                            <button class="btn btn-icon" id="prevPage" title="Página anterior">
                                <span class="material-icons">chevron_left</span>
                            </button>
                            <span class="page-info">Página 1 de 1</span>
                            <button class="btn btn-icon" id="nextPage" title="Próxima página">
                                <span class="material-icons">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Alternar painel de busca
        const toggleBtn = document.getElementById('toggleSearch');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleSearch());
        }

        // Realizar busca
        const searchBtn = document.getElementById('performSearch');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.performSearch());
        }

        // Busca ao pressionar Enter
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        // Limpar histórico
        const clearHistoryBtn = document.getElementById('clearHistory');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        }

        // Navegação de páginas
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => this.navigatePage('prev'));
        }
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => this.navigatePage('next'));
        }
    }

    loadSearchHistory() {
        const savedHistory = localStorage.getItem('searchHistory');
        if (savedHistory) {
            this.searchHistory = JSON.parse(savedHistory);
            this.updateHistoryList();
        }
    }

    updateSearchHistory(query) {
        // Remover se já existe
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        
        // Adicionar no início
        this.searchHistory.unshift(query);
        
        // Manter apenas os últimos N itens
        if (this.searchHistory.length > this.maxHistoryItems) {
            this.searchHistory = this.searchHistory.slice(0, this.maxHistoryItems);
        }
        
        // Salvar no localStorage
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
        
        // Atualizar lista
        this.updateHistoryList();
    }

    updateHistoryList() {
        const historyList = document.querySelector('.history-list');
        if (!historyList) return;

        historyList.innerHTML = this.searchHistory.map(query => `
            <div class="history-item">
                <span class="material-icons">history</span>
                <span class="query">${query}</span>
                <button class="btn btn-icon" title="Remover do histórico">
                    <span class="material-icons">close</span>
                </button>
            </div>
        `).join('');

        // Adicionar listeners aos botões de remover
        this.setupHistoryItemListeners();
    }

    setupHistoryItemListeners() {
        const historyItems = document.querySelectorAll('.history-item');
        historyItems.forEach(item => {
            const removeBtn = item.querySelector('button');
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    const query = item.querySelector('.query').textContent;
                    this.removeFromHistory(query);
                });
            }
        });
    }

    removeFromHistory(query) {
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
        this.updateHistoryList();
    }

    clearHistory() {
        this.searchHistory = [];
        localStorage.removeItem('searchHistory');
        this.updateHistoryList();
    }

    performSearch() {
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) return;

        const query = searchInput.value.trim();
        if (!query) {
            showNotification('Por favor, digite um termo de busca', 'warning');
            return;
        }

        // Atualizar histórico
        this.updateSearchHistory(query);

        // Simular busca (substituir por chamada real à API)
        this.searchBible(query);
    }

    searchBible(query) {
        // Simular chamada à API
        setTimeout(() => {
            const mockResults = [
                {
                    book: 'João',
                    chapter: 3,
                    verse: 16,
                    text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
                    relevance: 0.95
                },
                // Adicionar mais resultados mock aqui
            ];

            this.displayResults(mockResults);
        }, 500);
    }

    displayResults(results) {
        const resultsList = document.querySelector('.results-list');
        const resultsCount = document.querySelector('.results-count');
        if (!resultsList || !resultsCount) return;

        resultsCount.textContent = `${results.length} resultados`;

        resultsList.innerHTML = results.map(result => `
            <div class="result-item" data-book="${result.book}" data-chapter="${result.chapter}" data-verse="${result.verse}">
                <div class="result-header">
                    <span class="result-reference">${result.book} ${result.chapter}:${result.verse}</span>
                    <span class="result-relevance">${Math.round(result.relevance * 100)}% relevante</span>
                </div>
                <div class="result-text">${result.text}</div>
            </div>
        `).join('');

        // Adicionar listeners aos resultados
        this.setupResultItemListeners();
    }

    setupResultItemListeners() {
        const resultItems = document.querySelectorAll('.result-item');
        resultItems.forEach(item => {
            item.addEventListener('click', () => {
                const book = item.dataset.book;
                const chapter = item.dataset.chapter;
                const verse = item.dataset.verse;

                // Emitir evento de seleção de versículo
                const event = new CustomEvent('verseSelected', {
                    detail: { book, chapter, verse }
                });
                document.dispatchEvent(event);
            });
        });
    }

    navigatePage(direction) {
        // Implementar navegação de páginas
        console.log(`Navegando para ${direction === 'prev' ? 'página anterior' : 'próxima página'}`);
    }

    toggleSearch() {
        const container = document.querySelector('.search-container');
        if (!container) return;

        container.classList.toggle('collapsed');
    }
}

// Exportar uma única instância
export const bibleSearch = new BibleSearch(); 