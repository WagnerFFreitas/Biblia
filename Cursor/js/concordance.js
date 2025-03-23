import { Utils } from './common.js';
import { CONFIG } from './config.js';

class Concordance {
    constructor() {
        this.words = [];
        this.versions = [];
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            await this.loadConcordance();
            this.setupUI();
            this.setupEventListeners();
            this.isInitialized = true;
        } catch (error) {
            console.error('Erro ao inicializar concordância:', error);
            Utils.showNotification('Erro ao carregar concordância', 'error');
        }
    }

    async loadConcordance() {
        try {
            const response = await fetch('/api/concordance');
            if (!response.ok) throw new Error('Erro ao carregar concordância');
            
            const data = await response.json();
            this.words = data.words;
            this.versions = data.versions;
            
            this.updateResultsList();
            this.updateStatistics();
        } catch (error) {
            console.error('Erro ao carregar concordância:', error);
            throw error;
        }
    }

    setupUI() {
        // Atualiza os filtros
        this.updateFilters();
        
        // Atualiza a lista de resultados
        this.updateResultsList();
    }

    setupEventListeners() {
        // Busca de palavras
        const searchInput = document.getElementById('concordanceSearch');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }

        // Filtros
        const versionSelect = document.getElementById('searchVersion');
        const languageSelect = document.getElementById('searchLanguage');
        const exactMatchCheckbox = document.getElementById('exactMatch');
        const caseSensitiveCheckbox = document.getElementById('caseSensitive');
        
        if (versionSelect) {
            versionSelect.addEventListener('change', this.handleFilterChange.bind(this));
        }
        if (languageSelect) {
            languageSelect.addEventListener('change', this.handleFilterChange.bind(this));
        }
        if (exactMatchCheckbox) {
            exactMatchCheckbox.addEventListener('change', this.handleFilterChange.bind(this));
        }
        if (caseSensitiveCheckbox) {
            caseSensitiveCheckbox.addEventListener('change', this.handleFilterChange.bind(this));
        }

        // Paginação
        const prevButton = document.querySelector('.prev-page');
        const nextButton = document.querySelector('.next-page');
        
        if (prevButton) {
            prevButton.addEventListener('click', () => this.changePage(this.currentPage - 1));
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => this.changePage(this.currentPage + 1));
        }
    }

    updateFilters() {
        const versionSelect = document.getElementById('searchVersion');
        if (versionSelect) {
            versionSelect.innerHTML = `
                <option value="">Todas as versões</option>
                ${this.versions.map(version => `
                    <option value="${version.id}">${version.name}</option>
                `).join('')}
            `;
        }
    }

    updateResultsList() {
        const container = document.getElementById('searchResults');
        if (!container) return;

        const filteredResults = this.filterResults();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageResults = filteredResults.slice(startIndex, endIndex);

        container.innerHTML = pageResults.map(result => `
            <div class="result-item" data-id="${result.id}">
                <div class="result-header">
                    <h3>${result.word}</h3>
                    <span class="result-count">${result.count} ocorrências</span>
                </div>
                <div class="result-preview">
                    <p>${result.preview}</p>
                    <span class="reference">${result.reference}</span>
                </div>
                <div class="result-actions">
                    <button class="view-context">
                        <span class="material-icons">visibility</span>
                    </button>
                    <button class="copy-text">
                        <span class="material-icons">content_copy</span>
                    </button>
                </div>
            </div>
        `).join('');

        // Atualiza contagem de resultados
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = filteredResults.length;
        }

        // Atualiza paginação
        this.updatePagination(filteredResults.length);

        // Adiciona eventos aos resultados
        container.querySelectorAll('.result-item').forEach(item => {
            const viewButton = item.querySelector('.view-context');
            const copyButton = item.querySelector('.copy-text');

            if (viewButton) {
                viewButton.addEventListener('click', () => this.showContext(item.dataset.id));
            }
            if (copyButton) {
                copyButton.addEventListener('click', () => this.copyText(item.dataset.id));
            }
        });
    }

    filterResults() {
        const searchTerm = document.getElementById('concordanceSearch')?.value || '';
        const version = document.getElementById('searchVersion')?.value || '';
        const language = document.getElementById('searchLanguage')?.value || '';
        const exactMatch = document.getElementById('exactMatch')?.checked || false;
        const caseSensitive = document.getElementById('caseSensitive')?.checked || false;

        return this.words.filter(word => {
            const searchRegex = new RegExp(
                exactMatch ? `^${searchTerm}$` : searchTerm,
                caseSensitive ? '' : 'i'
            );

            const matchesSearch = searchRegex.test(word.term);
            const matchesVersion = !version || word.version === version;
            const matchesLanguage = !language || word.language === language;

            return matchesSearch && matchesVersion && matchesLanguage;
        });
    }

    updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const currentPageElement = document.getElementById('currentPage');
        const totalPagesElement = document.getElementById('totalPages');
        const prevButton = document.querySelector('.prev-page');
        const nextButton = document.querySelector('.next-page');

        if (currentPageElement) currentPageElement.textContent = this.currentPage;
        if (totalPagesElement) totalPagesElement.textContent = totalPages;
        if (prevButton) prevButton.disabled = this.currentPage === 1;
        if (nextButton) nextButton.disabled = this.currentPage === totalPages;
    }

    changePage(page) {
        const totalItems = this.filterResults().length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);

        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.updateResultsList();
        }
    }

    async showContext(resultId) {
        const result = this.words.find(w => w.id === resultId);
        if (!result) return;

        const modal = document.getElementById('contextModal');
        if (!modal) return;

        // Atualiza o conteúdo do modal
        document.getElementById('contextTitle').textContent = result.word;
        modal.querySelector('.reference').textContent = result.reference;
        modal.querySelector('.version').textContent = this.getVersionName(result.version);
        modal.querySelector('.context-text').innerHTML = result.context;

        // Mostra o modal
        modal.classList.add('active');

        // Adiciona eventos aos botões
        const readMoreButton = modal.querySelector('.read-more');
        const copyButton = modal.querySelector('.copy-text');
        const shareButton = modal.querySelector('.share-text');
        const closeButton = modal.querySelector('.close-modal');

        if (readMoreButton) {
            readMoreButton.addEventListener('click', () => this.handleReadMore(result.reference));
        }
        if (copyButton) {
            copyButton.addEventListener('click', () => this.copyText(resultId));
        }
        if (shareButton) {
            shareButton.addEventListener('click', () => this.shareText(resultId));
        }
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeModal(modal));
        }
    }

    getVersionName(id) {
        const version = this.versions.find(v => v.id === id);
        return version ? version.name : id;
    }

    async copyText(resultId) {
        const result = this.words.find(w => w.id === resultId);
        if (!result) return;

        try {
            await navigator.clipboard.writeText(result.context);
            Utils.showNotification('Texto copiado para a área de transferência', 'success');
        } catch (error) {
            console.error('Erro ao copiar texto:', error);
            Utils.showNotification('Erro ao copiar texto', 'error');
        }
    }

    async shareText(resultId) {
        const result = this.words.find(w => w.id === resultId);
        if (!result) return;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: result.word,
                    text: result.context,
                    url: window.location.href
                });
            } else {
                Utils.showNotification('Compartilhamento não suportado neste navegador', 'info');
            }
        } catch (error) {
            console.error('Erro ao compartilhar texto:', error);
        }
    }

    handleReadMore(reference) {
        // Implementar navegação para a referência bíblica
        console.log('Navegando para:', reference);
    }

    closeModal(modal) {
        modal.classList.remove('active');
    }

    updateStatistics() {
        const totalWords = this.words.reduce((sum, word) => sum + word.count, 0);
        const uniqueWords = this.words.length;
        const totalVerses = this.words.reduce((sum, word) => sum + word.verses.length, 0);
        const totalBooks = new Set(this.words.map(word => word.reference.split(' ')[0])).size;

        document.getElementById('totalWords').textContent = totalWords.toLocaleString();
        document.getElementById('uniqueWords').textContent = uniqueWords.toLocaleString();
        document.getElementById('totalVerses').textContent = totalVerses.toLocaleString();
        document.getElementById('totalBooks').textContent = totalBooks.toLocaleString();
    }

    handleSearch() {
        this.currentPage = 1;
        this.updateResultsList();
    }

    handleFilterChange() {
        this.currentPage = 1;
        this.updateResultsList();
    }
}

// Exporta a classe
export const ConcordanceManager = new Concordance(); 