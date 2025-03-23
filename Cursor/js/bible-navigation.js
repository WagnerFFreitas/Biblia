import { BIBLE_CONFIG } from './config.js';
import { showNotification } from './common.js';

class BibleNavigation {
    constructor() {
        this.currentBook = null;
        this.currentChapter = null;
        this.isInitialized = false;
    }

    initialize() {
        this.setupNavigationUI();
        this.setupEventListeners();
        this.isInitialized = true;
    }

    setupNavigationUI() {
        const navigationSection = document.querySelector('.bible-navigation');
        if (!navigationSection) return;

        navigationSection.innerHTML = `
            <div class="navigation-container">
                <div class="navigation-header">
                    <h3>Navegação</h3>
                    <button class="btn btn-icon" id="toggleNavigation" title="Alternar painel de navegação">
                        <span class="material-icons">expand_more</span>
                    </button>
                </div>

                <div class="navigation-content">
                    <div class="testament-selector">
                        <button class="btn btn-tab active" data-testament="old">Antigo Testamento</button>
                        <button class="btn btn-tab" data-testament="new">Novo Testamento</button>
                    </div>

                    <div class="search-box">
                        <input type="text" class="search-input" placeholder="Buscar na Bíblia...">
                        <button class="btn btn-icon" id="performSearch" title="Buscar">
                            <span class="material-icons">search</span>
                        </button>
                    </div>

                    <div class="books-list">
                        <!-- Livros serão carregados dinamicamente -->
                    </div>

                    <div class="chapters-list">
                        <!-- Capítulos serão carregados dinamicamente -->
                    </div>

                    <div class="search-results">
                        <div class="results-header">
                            <h4>Resultados da Busca</h4>
                            <button class="btn btn-icon" id="clearSearch" title="Limpar busca">
                                <span class="material-icons">clear</span>
                            </button>
                        </div>
                        <div class="results-list">
                            <!-- Resultados serão carregados dinamicamente -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Alternar painel de navegação
        const toggleBtn = document.getElementById('toggleNavigation');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleNavigation());
        }

        // Seletor de testamento
        const testamentBtns = document.querySelectorAll('.testament-selector .btn');
        testamentBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const testament = btn.dataset.testament;
                this.switchTestament(testament);
            });
        });

        // Busca
        const searchBtn = document.getElementById('performSearch');
        const searchInput = document.querySelector('.search-input');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
        }
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        }

        // Limpar busca
        const clearSearchBtn = document.getElementById('clearSearch');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => this.clearSearch());
        }
    }

    switchTestament(testament) {
        const buttons = document.querySelectorAll('.testament-selector .btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.testament === testament);
        });

        this.displayBooks(testament);
    }

    displayBooks(testament) {
        const booksList = document.querySelector('.books-list');
        if (!booksList) return;

        const books = BIBLE_CONFIG.books.filter(book => 
            testament === 'old' ? book.testament === 'old' : book.testament === 'new'
        );

        booksList.innerHTML = books.map(book => `
            <div class="book-item ${book.id === this.currentBook ? 'active' : ''}" 
                 data-book="${book.id}">
                <span class="book-name">${book.name}</span>
                <span class="book-chapters">${book.chapters} capítulos</span>
            </div>
        `).join('');

        // Adicionar listeners aos livros
        this.setupBookListeners();
    }

    setupBookListeners() {
        const books = document.querySelectorAll('.book-item');
        books.forEach(book => {
            book.addEventListener('click', () => {
                const bookId = book.dataset.book;
                this.selectBook(bookId);
            });
        });
    }

    selectBook(bookId) {
        const book = BIBLE_CONFIG.books.find(b => b.id === bookId);
        if (!book) return;

        this.currentBook = bookId;
        this.displayChapters(book.chapters);
        this.updateActiveStates();
    }

    displayChapters(totalChapters) {
        const chaptersList = document.querySelector('.chapters-list');
        if (!chaptersList) return;

        chaptersList.innerHTML = Array.from({ length: totalChapters }, (_, i) => i + 1)
            .map(chapter => `
                <div class="chapter-item ${chapter === this.currentChapter ? 'active' : ''}" 
                     data-chapter="${chapter}">
                    ${chapter}
                </div>
            `).join('');

        // Adicionar listeners aos capítulos
        this.setupChapterListeners();
    }

    setupChapterListeners() {
        const chapters = document.querySelectorAll('.chapter-item');
        chapters.forEach(chapter => {
            chapter.addEventListener('click', () => {
                const chapterNum = parseInt(chapter.dataset.chapter);
                this.selectChapter(chapterNum);
            });
        });
    }

    selectChapter(chapter) {
        this.currentChapter = chapter;
        this.updateActiveStates();
        this.emitChapterSelected();
    }

    updateActiveStates() {
        // Atualizar estado ativo dos livros
        const books = document.querySelectorAll('.book-item');
        books.forEach(book => {
            book.classList.toggle('active', book.dataset.book === this.currentBook);
        });

        // Atualizar estado ativo dos capítulos
        const chapters = document.querySelectorAll('.chapter-item');
        chapters.forEach(chapter => {
            chapter.classList.toggle('active', 
                parseInt(chapter.dataset.chapter) === this.currentChapter);
        });
    }

    async handleSearch() {
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) return;

        const query = searchInput.value.trim();
        if (!query) {
            showNotification('Por favor, digite um termo de busca', 'warning');
            return;
        }

        try {
            const results = await this.searchBible(query);
            this.displaySearchResults(results);
        } catch (error) {
            console.error('Erro na busca:', error);
            showNotification('Erro ao realizar busca', 'error');
        }
    }

    async searchBible(query) {
        // Simular chamada à API
        await new Promise(resolve => setTimeout(resolve, 500));

        // Retornar dados mock
        return [
            {
                book: 'João',
                chapter: 3,
                verse: 16,
                text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito...',
                relevance: 0.95
            },
            // Adicionar mais resultados mock aqui
        ];
    }

    displaySearchResults(results) {
        const resultsList = document.querySelector('.results-list');
        if (!resultsList) return;

        if (results.length === 0) {
            resultsList.innerHTML = `
                <div class="no-results">
                    <span class="material-icons">search_off</span>
                    <p>Nenhum resultado encontrado</p>
                </div>
            `;
            return;
        }

        resultsList.innerHTML = results.map(result => `
            <div class="search-result" 
                 data-book="${result.book}" 
                 data-chapter="${result.chapter}" 
                 data-verse="${result.verse}">
                <div class="result-header">
                    <span class="result-reference">${result.book} ${result.chapter}:${result.verse}</span>
                    <span class="result-relevance">${Math.round(result.relevance * 100)}% relevante</span>
                </div>
                <div class="result-text">${result.text}</div>
            </div>
        `).join('');

        // Adicionar listeners aos resultados
        this.setupSearchResultListeners();
    }

    setupSearchResultListeners() {
        const results = document.querySelectorAll('.search-result');
        results.forEach(result => {
            result.addEventListener('click', () => {
                const book = result.dataset.book;
                const chapter = result.dataset.chapter;
                const verse = result.dataset.verse;

                this.selectBook(book);
                this.selectChapter(parseInt(chapter));
                this.clearSearch();
            });
        });
    }

    clearSearch() {
        const searchInput = document.querySelector('.search-input');
        const resultsList = document.querySelector('.results-list');
        
        if (searchInput) {
            searchInput.value = '';
        }
        
        if (resultsList) {
            resultsList.innerHTML = '';
        }
    }

    toggleNavigation() {
        const container = document.querySelector('.navigation-container');
        if (!container) return;

        container.classList.toggle('collapsed');
    }

    emitChapterSelected() {
        const event = new CustomEvent('chapterSelected', {
            detail: {
                book: this.currentBook,
                chapter: this.currentChapter
            }
        });
        document.dispatchEvent(event);
    }
}

// Exportar uma única instância
export const bibleNavigation = new BibleNavigation(); 