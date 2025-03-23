import { Utils } from './common.js';
import { CONFIG } from './config.js';

class Hymns {
    constructor() {
        this.currentBook = null;
        this.currentHymn = null;
        this.hymns = [];
        this.categories = [];
        this.authors = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.isInitialized = false;
    }

    async init() {
        if (this.isInitialized) return;

        try {
            await this.loadHymnBooks();
            this.setupUI();
            this.setupEventListeners();
            this.isInitialized = true;
        } catch (error) {
            console.error('Erro ao inicializar hinários:', error);
            Utils.showNotification('Erro ao carregar hinários', 'error');
        }
    }

    async loadHymnBooks() {
        try {
            const response = await fetch('/api/hymn-books');
            if (!response.ok) throw new Error('Erro ao carregar hinários');
            
            const data = await response.json();
            this.hymns = data.hymns;
            this.categories = data.categories;
            this.authors = data.authors;
            
            this.updateHymnBooksUI();
        } catch (error) {
            console.error('Erro ao carregar hinários:', error);
            throw error;
        }
    }

    setupUI() {
        // Atualiza os filtros
        this.updateFilters();
        
        // Atualiza a lista de hinos
        this.updateHymnsList();
    }

    setupEventListeners() {
        // Busca de hinos
        const searchInput = document.getElementById('hymnSearch');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }

        // Filtros
        const categorySelect = document.getElementById('hymnCategory');
        const authorSelect = document.getElementById('hymnAuthor');
        
        if (categorySelect) {
            categorySelect.addEventListener('change', this.handleFilterChange.bind(this));
        }
        if (authorSelect) {
            authorSelect.addEventListener('change', this.handleFilterChange.bind(this));
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
        const categorySelect = document.getElementById('hymnCategory');
        const authorSelect = document.getElementById('hymnAuthor');

        if (categorySelect) {
            categorySelect.innerHTML = `
                <option value="">Todas as categorias</option>
                ${this.categories.map(category => `
                    <option value="${category.id}">${category.name}</option>
                `).join('')}
            `;
        }

        if (authorSelect) {
            authorSelect.innerHTML = `
                <option value="">Todos os autores</option>
                ${this.authors.map(author => `
                    <option value="${author.id}">${author.name}</option>
                `).join('')}
            `;
        }
    }

    updateHymnBooksUI() {
        const container = document.getElementById('hymnBooks');
        if (!container) return;

        container.innerHTML = CONFIG.HYMN_BOOKS.map(book => `
            <div class="hymn-book-card" data-id="${book.id}">
                <img src="${book.image}" alt="${book.name}" loading="lazy">
                <h3>${book.name}</h3>
                <p>${book.description}</p>
            </div>
        `).join('');

        // Adiciona eventos aos cards
        container.querySelectorAll('.hymn-book-card').forEach(card => {
            card.addEventListener('click', () => this.selectHymnBook(card.dataset.id));
        });
    }

    updateHymnsList() {
        const container = document.getElementById('hymnsList');
        if (!container) return;

        const filteredHymns = this.filterHymns();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageHymns = filteredHymns.slice(startIndex, endIndex);

        container.innerHTML = pageHymns.map(hymn => `
            <div class="hymn-card" data-id="${hymn.id}">
                <div class="hymn-number">${hymn.number}</div>
                <h3>${hymn.title}</h3>
                <p>${hymn.author}</p>
                <div class="hymn-actions">
                    <button class="view-hymn">
                        <span class="material-icons">visibility</span>
                    </button>
                    <button class="play-hymn">
                        <span class="material-icons">music_note</span>
                    </button>
                </div>
            </div>
        `).join('');

        // Atualiza paginação
        this.updatePagination(filteredHymns.length);

        // Adiciona eventos aos cards
        container.querySelectorAll('.hymn-card').forEach(card => {
            const viewButton = card.querySelector('.view-hymn');
            const playButton = card.querySelector('.play-hymn');

            if (viewButton) {
                viewButton.addEventListener('click', () => this.showHymnDetails(card.dataset.id));
            }
            if (playButton) {
                playButton.addEventListener('click', () => this.playHymn(card.dataset.id));
            }
        });
    }

    filterHymns() {
        const searchTerm = document.getElementById('hymnSearch')?.value.toLowerCase() || '';
        const category = document.getElementById('hymnCategory')?.value || '';
        const author = document.getElementById('hymnAuthor')?.value || '';

        return this.hymns.filter(hymn => {
            const matchesSearch = hymn.title.toLowerCase().includes(searchTerm) ||
                                hymn.author.toLowerCase().includes(searchTerm);
            const matchesCategory = !category || hymn.category === category;
            const matchesAuthor = !author || hymn.authorId === author;

            return matchesSearch && matchesCategory && matchesAuthor;
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
        const totalItems = this.filterHymns().length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);

        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.updateHymnsList();
        }
    }

    async showHymnDetails(hymnId) {
        const hymn = this.hymns.find(h => h.id === hymnId);
        if (!hymn) return;

        const modal = document.getElementById('hymnModal');
        if (!modal) return;

        // Atualiza o conteúdo do modal
        document.getElementById('hymnTitle').textContent = hymn.title;
        modal.querySelector('.hymn-number').textContent = `Hino ${hymn.number}`;
        modal.querySelector('.hymn-author').textContent = hymn.author;
        modal.querySelector('.hymn-category').textContent = hymn.category;
        modal.querySelector('.hymn-text').innerHTML = hymn.text;

        // Mostra o modal
        modal.classList.add('active');

        // Adiciona eventos aos botões
        const playButton = modal.querySelector('.play-audio');
        const downloadButton = modal.querySelector('.download-sheet');
        const shareButton = modal.querySelector('.share-hymn');
        const closeButton = modal.querySelector('.close-modal');

        if (playButton) {
            playButton.addEventListener('click', () => this.playHymn(hymnId));
        }
        if (downloadButton) {
            downloadButton.addEventListener('click', () => this.downloadSheet(hymnId));
        }
        if (shareButton) {
            shareButton.addEventListener('click', () => this.shareHymn(hymnId));
        }
        if (closeButton) {
            closeButton.addEventListener('click', () => this.closeModal(modal));
        }
    }

    async playHymn(hymnId) {
        const hymn = this.hymns.find(h => h.id === hymnId);
        if (!hymn || !hymn.audioUrl) return;

        try {
            const audio = new Audio(hymn.audioUrl);
            await audio.play();
        } catch (error) {
            console.error('Erro ao reproduzir hino:', error);
            Utils.showNotification('Erro ao reproduzir hino', 'error');
        }
    }

    async downloadSheet(hymnId) {
        const hymn = this.hymns.find(h => h.id === hymnId);
        if (!hymn || !hymn.sheetUrl) return;

        try {
            const response = await fetch(hymn.sheetUrl);
            if (!response.ok) throw new Error('Erro ao baixar partitura');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `hino-${hymn.number}-${hymn.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erro ao baixar partitura:', error);
            Utils.showNotification('Erro ao baixar partitura', 'error');
        }
    }

    async shareHymn(hymnId) {
        const hymn = this.hymns.find(h => h.id === hymnId);
        if (!hymn) return;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: `Hino ${hymn.number} - ${hymn.title}`,
                    text: hymn.text,
                    url: window.location.href
                });
            } else {
                Utils.showNotification('Compartilhamento não suportado neste navegador', 'info');
            }
        } catch (error) {
            console.error('Erro ao compartilhar hino:', error);
        }
    }

    closeModal(modal) {
        modal.classList.remove('active');
    }

    handleSearch() {
        this.currentPage = 1;
        this.updateHymnsList();
    }

    handleFilterChange() {
        this.currentPage = 1;
        this.updateHymnsList();
    }

    handleViewModeChange(event) {
        const view = event.currentTarget.dataset.view;
        const container = document.getElementById('hymnsList');
        
        if (!container) return;

        // Atualiza os botões
        document.querySelectorAll('.view-mode').forEach(button => {
            button.classList.toggle('active', button.dataset.view === view);
        });

        // Atualiza o container
        container.className = view === 'grid' ? 'hymns-grid' : 'hymns-list';
    }
}

// Exporta a classe
export const HymnsManager = new Hymns(); 