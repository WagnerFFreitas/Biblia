import { Utils } from './common.js';
import { CONFIG } from './config.js';

class Dictionary {
    constructor() {
        this.words = [];
        this.categories = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            await this.loadDictionary();
            this.setupUI();
            this.setupEventListeners();
            this.isInitialized = true;
        } catch (error) {
            console.error('Erro ao inicializar dicionário:', error);
            Utils.showNotification('Erro ao carregar dicionário', 'error');
        }
    }

    async loadDictionary() {
        try {
            const response = await fetch('/api/dictionary');
            if (!response.ok) throw new Error('Erro ao carregar dicionário');
            
            const data = await response.json();
            this.words = data.words;
            this.categories = data.categories;
            
            this.updateWordsList();
        } catch (error) {
            console.error('Erro ao carregar dicionário:', error);
            throw error;
        }
    }

    setupUI() {
        // Atualiza os filtros
        this.updateFilters();
        
        // Atualiza a lista de palavras
        this.updateWordsList();
    }

    setupEventListeners() {
        // Busca de palavras
        const searchInput = document.getElementById('dictionarySearch');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }

        // Filtros
        const categorySelect = document.getElementById('searchCategory');
        const languageSelect = document.getElementById('searchLanguage');
        
        if (categorySelect) {
            categorySelect.addEventListener('change', this.handleFilterChange.bind(this));
        }
        if (languageSelect) {
            languageSelect.addEventListener('change', this.handleFilterChange.bind(this));
        }

        // Modos de visualização
        const viewModes = document.querySelectorAll('.view-mode');
        viewModes.forEach(mode => {
            mode.addEventListener('click', this.handleViewModeChange.bind(this));
        });

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
        const categorySelect = document.getElementById('searchCategory');
        if (categorySelect) {
            categorySelect.innerHTML = `
                <option value="">Todas as categorias</option>
                ${this.categories.map(category => `
                    <option value="${category.id}">${category.name}</option>
                `).join('')}
            `;
        }
    }

    updateWordsList() {
        const container = document.getElementById('wordsList');
        if (!container) return;

        const filteredWords = this.filterWords();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageWords = filteredWords.slice(startIndex, endIndex);

        container.innerHTML = pageWords.map(word => `
            <div class="word-card" data-id="${word.id}">
                <h3>${word.term}</h3>
                <p class="word-category">${word.category}</p>
                <p class="word-language">${this.getLanguageName(word.language)}</p>
                <div class="word-actions">
                    <button class="view-word">
                        <span class="material-icons">visibility</span>
                    </button>
                    <button class="play-word">
                        <span class="material-icons">volume_up</span>
                    </button>
                </div>
            </div>
        `).join('');

        // Atualiza paginação
        this.updatePagination(filteredWords.length);
    }

    filterWords() {
        const searchTerm = document.getElementById('dictionarySearch')?.value.toLowerCase() || '';
        const category = document.getElementById('searchCategory')?.value || '';
        const language = document.getElementById('searchLanguage')?.value || '';

        return this.words.filter(word => {
            const matchesSearch = word.term.toLowerCase().includes(searchTerm) ||
                                word.definition.toLowerCase().includes(searchTerm);
            const matchesCategory = !category || word.category === category;
            const matchesLanguage = !language || word.language === language;

            return matchesSearch && matchesCategory && matchesLanguage;
        });
    }

    getLanguageName(code) {
        const languages = {
            'pt': 'Português',
            'he': 'Hebraico',
            'gr': 'Grego'
        };
        return languages[code] || code;
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
        const totalItems = this.filterWords().length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);

        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.updateWordsList();
        }
    }

    async showWordDetails(wordId) {
        const word = this.words.find(w => w.id === wordId);
        if (!word) return;

        const modal = document.getElementById('wordModal');
        if (!modal) return;

        // Atualiza o conteúdo do modal
        document.getElementById('wordTitle').textContent = word.term;
        modal.querySelector('.word-original').textContent = word.original;
        modal.querySelector('.word-category').textContent = word.category;
        modal.querySelector('.word-language').textContent = this.getLanguageName(word.language);
        modal.querySelector('.word-definition').innerHTML = word.definition;

        // Atualiza exemplos
        const examplesList = modal.querySelector('.examples-list');
        if (examplesList) {
            examplesList.innerHTML = word.examples.map(example => `
                <div class="example-item">
                    <p>${example.text}</p>
                    <span class="reference">${example.reference}</span>
                </div>
            `).join('');
        }

        // Atualiza referências
        const referencesList = modal.querySelector('.references-list');
        if (referencesList) {
            referencesList.innerHTML = word.references.map(ref => `
                <div class="reference-item">
                    <a href="#" data-reference="${ref}">${ref}</a>
                </div>
            `).join('');
        }

        // Mostra o modal
        modal.classList.add('active');

        // Adiciona eventos aos botões
        const playButton = modal.querySelector('.play-audio');
        const shareButton = modal.querySelector('.share-word');
        const closeButton = modal.querySelector('.close-modal');

        if (playButton) {
            playButton.addEventListener('click', () => this.playWord(wordId));
        }
        if (shareButton) {
            shareButton.addEventListener('click', () => this.shareWord(wordId));
        }
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeModal(modal));
        }

        // Adiciona eventos às referências
        referencesList?.querySelectorAll('.reference-item a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleReferenceClick(link.dataset.reference);
            });
        });
    }

    async playWord(wordId) {
        const word = this.words.find(w => w.id === wordId);
        if (!word || !word.audioUrl) return;

        try {
            const audio = new Audio(word.audioUrl);
            await audio.play();
        } catch (error) {
            console.error('Erro ao reproduzir áudio:', error);
            Utils.showNotification('Erro ao reproduzir áudio', 'error');
        }
    }

    async shareWord(wordId) {
        const word = this.words.find(w => w.id === wordId);
        if (!word) return;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: word.term,
                    text: word.definition,
                    url: window.location.href
                });
            } else {
                Utils.showNotification('Compartilhamento não suportado neste navegador', 'info');
            }
        } catch (error) {
            console.error('Erro ao compartilhar palavra:', error);
        }
    }

    handleReferenceClick(reference) {
        // Implementar navegação para a referência bíblica
        console.log('Navegando para:', reference);
    }

    closeModal(modal) {
        modal.classList.remove('active');
    }

    handleSearch() {
        this.currentPage = 1;
        this.updateWordsList();
    }

    handleFilterChange() {
        this.currentPage = 1;
        this.updateWordsList();
    }

    handleViewModeChange(event) {
        const view = event.currentTarget.dataset.view;
        const container = document.getElementById('wordsList');
        
        if (!container) return;

        // Atualiza os botões
        document.querySelectorAll('.view-mode').forEach(button => {
            button.classList.toggle('active', button.dataset.view === view);
        });

        // Atualiza o container
        container.className = view === 'grid' ? 'words-grid' : 'words-list';
    }
}

// Exporta a classe
export const DictionaryManager = new Dictionary(); 