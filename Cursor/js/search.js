import { SEARCH_CONFIG } from './config.js';
import { showNotification } from './common.js';

class SearchManager {
    constructor() {
        this.searchQuery = '';
        this.searchType = 'all';
        this.searchResults = [];
        this.isSearching = false;
        this.isInitialized = false;
    }

    initialize() {
        this.setupEventListeners();
        this.isInitialized = true;
    }

    setupEventListeners() {
        // Listener para input de busca
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.debouncedSearch();
            });
        }

        // Listener para seleção de tipo de busca
        const searchTypeSelect = document.getElementById('search-type-select');
        if (searchTypeSelect) {
            searchTypeSelect.addEventListener('change', (e) => {
                this.searchType = e.target.value;
                this.debouncedSearch();
            });
        }

        // Listener para botão de busca
        const searchButton = document.getElementById('search-button');
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                this.performSearch();
            });
        }

        // Listener para tecla Enter
        const searchForm = document.getElementById('search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.performSearch();
            });
        }
    }

    debouncedSearch() {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        this.searchTimeout = setTimeout(() => {
            this.performSearch();
        }, SEARCH_CONFIG.debounceDelay);
    }

    async performSearch() {
        if (!this.searchQuery.trim()) {
            this.clearResults();
            return;
        }

        this.isSearching = true;
        this.updateSearchStatus();

        try {
            switch (this.searchType) {
                case 'bible':
                    await this.searchBible();
                    break;
                case 'hymns':
                    await this.searchHymns();
                    break;
                case 'study':
                    await this.searchStudy();
                    break;
                case 'resources':
                    await this.searchResources();
                    break;
                case 'all':
                    await this.searchAll();
                    break;
            }

            this.displayResults();
        } catch (error) {
            showNotification('Erro ao realizar busca', 'error');
            console.error('Erro na busca:', error);
        } finally {
            this.isSearching = false;
            this.updateSearchStatus();
        }
    }

    async searchBible() {
        // Simular busca na Bíblia
        this.searchResults = [
            {
                type: 'bible',
                title: 'João 3:16',
                content: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
                relevance: 0.95
            },
            {
                type: 'bible',
                title: 'Romanos 8:28',
                content: 'E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.',
                relevance: 0.85
            }
        ];
    }

    async searchHymns() {
        // Simular busca nos hinos
        this.searchResults = [
            {
                type: 'hymns',
                title: 'Hino 123 - Amor de Deus',
                content: 'O amor de Deus é tão grande, tão profundo e tão alto...',
                relevance: 0.90
            }
        ];
    }

    async searchStudy() {
        // Simular busca nos estudos
        this.searchResults = [
            {
                type: 'study',
                title: 'Estudo sobre o Amor de Deus',
                content: 'Neste estudo, vamos explorar o amor de Deus em suas diferentes manifestações...',
                relevance: 0.88
            }
        ];
    }

    async searchResources() {
        // Simular busca nos recursos
        this.searchResults = [
            {
                type: 'resources',
                title: 'Artigo: O Amor de Deus',
                content: 'Um artigo detalhado sobre o amor de Deus e sua importância...',
                relevance: 0.82
            }
        ];
    }

    async searchAll() {
        // Realizar busca em todas as categorias
        await Promise.all([
            this.searchBible(),
            this.searchHymns(),
            this.searchStudy(),
            this.searchResources()
        ]);

        // Ordenar resultados por relevância
        this.searchResults.sort((a, b) => b.relevance - a.relevance);
    }

    displayResults() {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;

        if (this.searchResults.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>Nenhum resultado encontrado para "${this.searchQuery}"</p>
                </div>
            `;
            return;
        }

        resultsContainer.innerHTML = this.searchResults.map(result => `
            <div class="search-result ${result.type}">
                <h3>${result.title}</h3>
                <p>${result.content}</p>
                <div class="result-meta">
                    <span class="result-type">${this.getTypeLabel(result.type)}</span>
                    <span class="result-relevance">${Math.round(result.relevance * 100)}% relevante</span>
                </div>
            </div>
        `).join('');
    }

    getTypeLabel(type) {
        const labels = {
            bible: 'Bíblia',
            hymns: 'Hinos',
            study: 'Estudos',
            resources: 'Recursos'
        };
        return labels[type] || type;
    }

    clearResults() {
        this.searchResults = [];
        const resultsContainer = document.getElementById('search-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
    }

    updateSearchStatus() {
        const searchStatus = document.getElementById('search-status');
        if (searchStatus) {
            searchStatus.textContent = this.isSearching ? 'Buscando...' : '';
        }
    }

    // Métodos para filtrar resultados
    filterResults(criteria) {
        return this.searchResults.filter(result => {
            return Object.entries(criteria).every(([key, value]) => {
                return result[key] === value;
            });
        });
    }

    // Métodos para ordenar resultados
    sortResults(criteria) {
        this.searchResults.sort((a, b) => {
            if (criteria === 'relevance') {
                return b.relevance - a.relevance;
            }
            if (criteria === 'date') {
                return new Date(b.date) - new Date(a.date);
            }
            return 0;
        });
    }

    // Métodos para paginação
    getPageResults(page, pageSize) {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return this.searchResults.slice(start, end);
    }

    // Métodos para histórico de busca
    saveToHistory() {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        history.unshift({
            query: this.searchQuery,
            type: this.searchType,
            timestamp: new Date().toISOString()
        });

        // Limitar histórico a 10 itens
        if (history.length > 10) {
            history.pop();
        }

        localStorage.setItem('searchHistory', JSON.stringify(history));
    }

    getSearchHistory() {
        return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    }

    clearSearchHistory() {
        localStorage.removeItem('searchHistory');
    }
}

// Criar e exportar a instância do gerenciador de busca
export const search = new SearchManager(); 