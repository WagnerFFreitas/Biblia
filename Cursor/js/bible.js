import CONFIG from './config.js';
import { showNotification } from './common.js';
import { userProgress } from './user-progress.js';

class BibleManager {
    constructor() {
        this.currentBook = null;
        this.currentChapter = null;
        this.currentVerse = null;
        this.isLoading = false;
        this.verseHighlights = new Set();
    }

    initialize() {
        this.setupBibleSection();
        this.setupEventListeners();
        this.loadLastRead();
    }

    setupBibleSection() {
        const bibleSection = document.querySelector('#bible');
        if (!bibleSection) return;

        bibleSection.innerHTML = `
            <div class="bible-container">
                <div class="bible-header">
                    <div class="book-selector">
                        <select id="bibleBook">
                            <option value="">Selecione um livro</option>
                            ${CONFIG.BIBLE_BOOKS.map(book => `
                                <option value="${book.id}">${book.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="chapter-selector">
                        <select id="bibleChapter">
                            <option value="">Capítulo</option>
                        </select>
                    </div>
                    <div class="search-bar">
                        <input type="text" id="bibleSearch" placeholder="Buscar na Bíblia...">
                        <button class="btn btn-icon" id="clearSearch">
                            <span class="material-icons">clear</span>
                        </button>
                    </div>
                </div>

                <div class="bible-content">
                    <div class="bible-text">
                        <div class="chapter-title"></div>
                        <div class="verses-container"></div>
                    </div>
                    <div class="bible-sidebar">
                        <div class="bookmarks-section">
                            <h3>Marcadores</h3>
                            <div class="bookmarks-list"></div>
                        </div>
                        <div class="notes-section">
                            <h3>Notas</h3>
                            <div class="notes-list"></div>
                        </div>
                    </div>
                </div>

                <div class="bible-footer">
                    <button class="btn btn-secondary" id="prevChapter">
                        <span class="material-icons">arrow_back</span>
                        Capítulo Anterior
                    </button>
                    <button class="btn btn-secondary" id="nextChapter">
                        Próximo Capítulo
                        <span class="material-icons">arrow_forward</span>
                    </button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Seletor de livro
        const bibleBookSelect = document.getElementById('bibleBook');
        if (bibleBookSelect) {
            bibleBookSelect.addEventListener('change', (e) => {
                this.selectBook(e.target.value);
            });
        }

        // Seletor de capítulo
        const chapterSelect = document.getElementById('bibleChapter');
        if (chapterSelect) {
            chapterSelect.addEventListener('change', (e) => {
                this.selectChapter(e.target.value);
            });
        }

        // Barra de busca
        const searchInput = document.getElementById('bibleSearch');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                this.searchBible(e.target.value);
            }, 300));
        }

        // Botão de limpar busca
        const clearButton = document.getElementById('clearSearch');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                searchInput.value = '';
                this.searchBible('');
            });
        }

        // Navegação entre capítulos
        const prevButton = document.getElementById('prevChapter');
        if (prevButton) {
            prevButton.addEventListener('click', () => this.navigateChapter(-1));
        }

        const nextButton = document.getElementById('nextChapter');
        if (nextButton) {
            nextButton.addEventListener('click', () => this.navigateChapter(1));
        }
    }

    async loadLastRead() {
        const lastRead = userProgress.getLastRead();
        if (lastRead && lastRead.type === 'bible') {
            await this.selectBook(lastRead.bookId);
            await this.selectChapter(lastRead.chapter);
        }
    }

    async selectBook(bookId) {
        const book = CONFIG.BIBLE_BOOKS.find(b => b.id === bookId);
        if (!book) return;

        this.currentBook = book;
        this.isLoading = true;

        try {
            // Atualiza o seletor de capítulos
            const chapterSelect = document.getElementById('bibleChapter');
            if (chapterSelect) {
                chapterSelect.innerHTML = `
                    <option value="">Capítulo</option>
                    ${Array.from({ length: book.chapters }, (_, i) => i + 1)
                        .map(chapter => `
                            <option value="${chapter}">${chapter}</option>
                        `).join('')}
                `;
            }

            // Carrega o primeiro capítulo por padrão
            await this.selectChapter('1');
        } catch (error) {
            console.error('Erro ao carregar livro:', error);
            showNotification('Erro ao carregar livro', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    async selectChapter(chapterNumber) {
        if (!this.currentBook) return;

        this.currentChapter = parseInt(chapterNumber);
        this.isLoading = true;

        try {
            const chapter = await this.fetchChapter(this.currentBook.id, this.currentChapter);
            this.displayChapter(chapter);
            this.updateLastRead();
            this.updateNavigationButtons();
        } catch (error) {
            console.error('Erro ao carregar capítulo:', error);
            showNotification('Erro ao carregar capítulo', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    displayChapter(chapter) {
        const chapterTitle = document.querySelector('.chapter-title');
        if (chapterTitle) {
            chapterTitle.textContent = `${this.currentBook.name} ${this.currentChapter}`;
        }

        const versesContainer = document.querySelector('.verses-container');
        if (versesContainer) {
            versesContainer.innerHTML = chapter.verses.map(verse => `
                <div class="verse ${this.verseHighlights.has(verse.number) ? 'highlighted' : ''}" 
                     data-verse="${verse.number}">
                    <span class="verse-number">${verse.number}</span>
                    <span class="verse-text">${verse.text}</span>
                    <div class="verse-actions">
                        <button class="btn btn-icon" onclick="bibleManager.toggleHighlight(${verse.number})">
                            <span class="material-icons">highlight</span>
                        </button>
                        <button class="btn btn-icon" onclick="bibleManager.addBookmark(${verse.number})">
                            <span class="material-icons">bookmark_border</span>
                        </button>
                        <button class="btn btn-icon" onclick="bibleManager.addNote(${verse.number})">
                            <span class="material-icons">note_add</span>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    updateNavigationButtons() {
        if (!this.currentBook) return;

        const prevButton = document.getElementById('prevChapter');
        const nextButton = document.getElementById('nextChapter');

        if (prevButton) {
            prevButton.disabled = this.currentChapter <= 1;
        }

        if (nextButton) {
            nextButton.disabled = this.currentChapter >= this.currentBook.chapters;
        }
    }

    async navigateChapter(direction) {
        if (!this.currentBook) return;

        const newChapter = this.currentChapter + direction;
        if (newChapter < 1 || newChapter > this.currentBook.chapters) return;

        await this.selectChapter(newChapter.toString());
    }

    async toggleHighlight(verseNumber) {
        try {
            const isHighlighted = this.verseHighlights.has(verseNumber);
            await this.updateVerseHighlight(verseNumber, !isHighlighted);

            if (isHighlighted) {
                this.verseHighlights.delete(verseNumber);
            } else {
                this.verseHighlights.add(verseNumber);
            }

            const verse = document.querySelector(`.verse[data-verse="${verseNumber}"]`);
            if (verse) {
                verse.classList.toggle('highlighted');
            }

            showNotification(
                isHighlighted ? 'Destaque removido' : 'Versículo destacado',
                'success'
            );
        } catch (error) {
            console.error('Erro ao atualizar destaque:', error);
            showNotification('Erro ao atualizar destaque', 'error');
        }
    }

    async addBookmark(verseNumber) {
        try {
            const bookmark = {
                bookId: this.currentBook.id,
                chapter: this.currentChapter,
                verse: verseNumber,
                timestamp: new Date().toISOString()
            };

            await this.saveBookmark(bookmark);
            this.updateBookmarksList();
            showNotification('Marcador adicionado', 'success');
        } catch (error) {
            console.error('Erro ao adicionar marcador:', error);
            showNotification('Erro ao adicionar marcador', 'error');
        }
    }

    async addNote(verseNumber) {
        const noteText = prompt('Digite sua nota:');
        if (!noteText) return;

        try {
            const note = {
                bookId: this.currentBook.id,
                chapter: this.currentChapter,
                verse: verseNumber,
                text: noteText,
                timestamp: new Date().toISOString()
            };

            await this.saveNote(note);
            this.updateNotesList();
            showNotification('Nota adicionada', 'success');
        } catch (error) {
            console.error('Erro ao adicionar nota:', error);
            showNotification('Erro ao adicionar nota', 'error');
        }
    }

    searchBible(query) {
        const verses = document.querySelectorAll('.verse');
        const searchTerm = query.toLowerCase();

        verses.forEach(verse => {
            const text = verse.querySelector('.verse-text').textContent.toLowerCase();
            const number = verse.querySelector('.verse-number').textContent;

            if (text.includes(searchTerm) || number.includes(searchTerm)) {
                verse.style.display = 'flex';
            } else {
                verse.style.display = 'none';
            }
        });
    }

    updateLastRead() {
        if (!this.currentBook || !this.currentChapter) return;

        userProgress.updateLastRead({
            type: 'bible',
            bookId: this.currentBook.id,
            chapter: this.currentChapter,
            timestamp: new Date().toISOString()
        });
    }

    async updateBookmarksList() {
        const bookmarksList = document.querySelector('.bookmarks-list');
        if (!bookmarksList) return;

        try {
            const bookmarks = await this.fetchBookmarks();
            bookmarksList.innerHTML = bookmarks.map(bookmark => `
                <div class="bookmark-item">
                    <div class="bookmark-info">
                        <h4>${bookmark.bookName} ${bookmark.chapter}:${bookmark.verse}</h4>
                        <p>${bookmark.timestamp}</p>
                    </div>
                    <button class="btn btn-icon" onclick="bibleManager.removeBookmark('${bookmark.id}')">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar marcadores:', error);
        }
    }

    async updateNotesList() {
        const notesList = document.querySelector('.notes-list');
        if (!notesList) return;

        try {
            const notes = await this.fetchNotes();
            notesList.innerHTML = notes.map(note => `
                <div class="note-item">
                    <div class="note-info">
                        <h4>${note.bookName} ${note.chapter}:${note.verse}</h4>
                        <p>${note.text}</p>
                        <small>${note.timestamp}</small>
                    </div>
                    <button class="btn btn-icon" onclick="bibleManager.removeNote('${note.id}')">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar notas:', error);
        }
    }

    // Métodos de simulação de API
    async fetchChapter(bookId, chapter) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 500));

        // Retorna dados simulados
        return {
            verses: Array.from({ length: 10 }, (_, i) => ({
                number: i + 1,
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            }))
        };
    }

    async updateVerseHighlight(verseNumber, isHighlighted) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }

    async saveBookmark(bookmark) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }

    async saveNote(note) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }

    async fetchBookmarks() {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return [];
    }

    async fetchNotes() {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return [];
    }

    async removeBookmark(bookmarkId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }

    async removeNote(noteId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }
}

// Exporta uma única instância
export const bibleManager = new BibleManager(); 