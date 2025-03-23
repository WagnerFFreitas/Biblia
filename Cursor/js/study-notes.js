import { STUDY_CONFIG } from './config.js';
import { showNotification } from './common.js';
import { userProgress } from './user-progress.js';

class StudyNotesManager {
    constructor() {
        this.notes = [];
        this.currentNote = null;
        this.isInitialized = false;
    }

    initialize() {
        this.setupNotesUI();
        this.setupEventListeners();
        this.loadNotes();
        this.isInitialized = true;
    }

    setupNotesUI() {
        const notesSection = document.querySelector('.study-notes');
        if (!notesSection) return;

        notesSection.innerHTML = `
            <div class="notes-container">
                <div class="notes-header">
                    <h3>Notas</h3>
                    <div class="notes-actions">
                        <button class="btn btn-icon" id="addNote">
                            <span class="material-icons">add</span>
                        </button>
                        <button class="btn btn-icon" id="searchNotes">
                            <span class="material-icons">search</span>
                        </button>
                    </div>
                </div>

                <div class="notes-content">
                    <div class="notes-list">
                        <!-- Lista de notas será preenchida dinamicamente -->
                    </div>

                    <div class="note-editor" style="display: none;">
                        <div class="editor-header">
                            <input type="text" class="note-title" placeholder="Título da nota">
                            <div class="editor-actions">
                                <button class="btn btn-icon" id="saveNote">
                                    <span class="material-icons">save</span>
                                </button>
                                <button class="btn btn-icon" id="deleteNote">
                                    <span class="material-icons">delete</span>
                                </button>
                            </div>
                        </div>

                        <div class="editor-content">
                            <div class="editor-toolbar">
                                <button class="btn btn-icon" title="Negrito">
                                    <span class="material-icons">format_bold</span>
                                </button>
                                <button class="btn btn-icon" title="Itálico">
                                    <span class="material-icons">format_italic</span>
                                </button>
                                <button class="btn btn-icon" title="Lista">
                                    <span class="material-icons">format_list_bulleted</span>
                                </button>
                                <button class="btn btn-icon" title="Citação">
                                    <span class="material-icons">format_quote</span>
                                </button>
                            </div>

                            <div class="editor-main">
                                <textarea class="note-content" placeholder="Digite sua nota aqui..."></textarea>
                            </div>

                            <div class="editor-sidebar">
                                <div class="sidebar-section">
                                    <h5>Tags</h5>
                                    <div class="tags-list">
                                        <!-- Tags serão preenchidas dinamicamente -->
                                    </div>
                                    <div class="tag-input">
                                        <input type="text" placeholder="Adicionar tag...">
                                        <button class="btn btn-icon">
                                            <span class="material-icons">add</span>
                                        </button>
                                    </div>
                                </div>

                                <div class="sidebar-section">
                                    <h5>Anexos</h5>
                                    <div class="attachments-list">
                                        <!-- Anexos serão preenchidos dinamicamente -->
                                    </div>
                                    <button class="btn btn-secondary" id="addAttachment">
                                        Adicionar Anexo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="search-panel" style="display: none;">
                        <div class="search-header">
                            <input type="text" class="search-input" placeholder="Buscar notas...">
                            <button class="btn btn-icon" id="closeSearch">
                                <span class="material-icons">close</span>
                            </button>
                        </div>
                        <div class="search-results">
                            <!-- Resultados da busca serão preenchidos dinamicamente -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Botões de ação
        const addNoteBtn = document.getElementById('addNote');
        if (addNoteBtn) {
            addNoteBtn.addEventListener('click', () => this.createNewNote());
        }

        const searchNotesBtn = document.getElementById('searchNotes');
        if (searchNotesBtn) {
            searchNotesBtn.addEventListener('click', () => this.toggleSearch());
        }

        const closeSearchBtn = document.getElementById('closeSearch');
        if (closeSearchBtn) {
            closeSearchBtn.addEventListener('click', () => this.toggleSearch());
        }

        const saveNoteBtn = document.getElementById('saveNote');
        if (saveNoteBtn) {
            saveNoteBtn.addEventListener('click', () => this.saveNote());
        }

        const deleteNoteBtn = document.getElementById('deleteNote');
        if (deleteNoteBtn) {
            deleteNoteBtn.addEventListener('click', () => this.deleteNote());
        }

        const addAttachmentBtn = document.getElementById('addAttachment');
        if (addAttachmentBtn) {
            addAttachmentBtn.addEventListener('click', () => this.addAttachment());
        }

        // Inputs
        const noteTitle = document.querySelector('.note-title');
        if (noteTitle) {
            noteTitle.addEventListener('input', () => this.handleTitleChange());
        }

        const noteContent = document.querySelector('.note-content');
        if (noteContent) {
            noteContent.addEventListener('input', () => this.handleContentChange());
        }

        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.handleSearch());
        }

        // Tag input
        const tagInput = document.querySelector('.tag-input input');
        const tagAddBtn = document.querySelector('.tag-input .btn-icon');
        if (tagInput && tagAddBtn) {
            tagAddBtn.addEventListener('click', () => this.addTag(tagInput.value));
            tagInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addTag(tagInput.value);
                }
            });
        }

        // Toolbar buttons
        const toolbarButtons = document.querySelectorAll('.editor-toolbar .btn-icon');
        toolbarButtons.forEach(button => {
            button.addEventListener('click', () => this.handleToolbarAction(button.title));
        });
    }

    async loadNotes() {
        try {
            const savedNotes = await this.fetchNotes();
            this.notes = savedNotes;
            this.displayNotesList();
        } catch (error) {
            console.error('Erro ao carregar notas:', error);
            showNotification('Erro ao carregar notas', 'error');
        }
    }

    displayNotesList() {
        const notesList = document.querySelector('.notes-list');
        if (!notesList) return;

        notesList.innerHTML = this.notes.map(note => `
            <div class="note-item ${note.id === this.currentNote?.id ? 'active' : ''}" 
                 data-id="${note.id}">
                <div class="note-header">
                    <h4>${note.title}</h4>
                    <span class="note-date">${this.formatDate(note.updatedAt)}</span>
                </div>
                <div class="note-preview">
                    ${this.truncateText(note.content, 150)}
                </div>
                <div class="note-tags">
                    ${note.tags.map(tag => `
                        <span class="tag">${tag}</span>
                    `).join('')}
                </div>
            </div>
        `).join('');

        // Adiciona listeners para as notas
        this.setupNotesListeners();
    }

    setupNotesListeners() {
        const notes = document.querySelectorAll('.note-item');
        notes.forEach(note => {
            note.addEventListener('click', () => {
                this.editNote(note.dataset.id);
            });
        });
    }

    createNewNote() {
        this.currentNote = {
            id: Date.now().toString(),
            title: 'Nova Nota',
            content: '',
            tags: [],
            attachments: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.displayNoteEditor();
    }

    editNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;

        this.currentNote = note;
        this.displayNoteEditor();
    }

    displayNoteEditor() {
        const editor = document.querySelector('.note-editor');
        if (!editor) return;

        editor.style.display = 'block';

        // Preenche campos
        const titleInput = editor.querySelector('.note-title');
        const contentTextarea = editor.querySelector('.note-content');
        const tagsList = editor.querySelector('.tags-list');
        const attachmentsList = editor.querySelector('.attachments-list');

        if (titleInput) {
            titleInput.value = this.currentNote.title;
        }

        if (contentTextarea) {
            contentTextarea.value = this.currentNote.content;
        }

        if (tagsList) {
            tagsList.innerHTML = this.currentNote.tags.map(tag => `
                <span class="tag">
                    ${tag}
                    <button class="btn btn-icon" onclick="studyNotes.removeTag('${tag}')">
                        <span class="material-icons">close</span>
                    </button>
                </span>
            `).join('');
        }

        if (attachmentsList) {
            attachmentsList.innerHTML = this.currentNote.attachments.map(attachment => `
                <div class="attachment-item">
                    <span class="material-icons">${this.getAttachmentIcon(attachment.type)}</span>
                    <span class="attachment-name">${attachment.name}</span>
                    <button class="btn btn-icon" onclick="studyNotes.removeAttachment('${attachment.id}')">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            `).join('');
        }
    }

    async saveNote() {
        if (!this.currentNote) return;

        try {
            const titleInput = document.querySelector('.note-title');
            const contentTextarea = document.querySelector('.note-content');

            if (titleInput) {
                this.currentNote.title = titleInput.value.trim();
            }

            if (contentTextarea) {
                this.currentNote.content = contentTextarea.value.trim();
            }

            this.currentNote.updatedAt = new Date().toISOString();

            // Atualiza ou adiciona a nota
            const index = this.notes.findIndex(n => n.id === this.currentNote.id);
            if (index === -1) {
                this.notes.push(this.currentNote);
            } else {
                this.notes[index] = this.currentNote;
            }

            await this.saveNoteToServer(this.currentNote);
            this.displayNotesList();
            this.hideNoteEditor();

            showNotification('Nota salva com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao salvar nota:', error);
            showNotification('Erro ao salvar nota', 'error');
        }
    }

    async deleteNote() {
        if (!this.currentNote) return;

        if (!confirm('Tem certeza que deseja excluir esta nota?')) {
            return;
        }

        try {
            await this.deleteNoteFromServer(this.currentNote.id);
            this.notes = this.notes.filter(n => n.id !== this.currentNote.id);
            this.currentNote = null;
            this.displayNotesList();
            this.hideNoteEditor();

            showNotification('Nota excluída com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao excluir nota:', error);
            showNotification('Erro ao excluir nota', 'error');
        }
    }

    addTag(tag) {
        if (!this.currentNote || !tag.trim()) return;

        const tagInput = document.querySelector('.tag-input input');
        if (!tagInput) return;

        const trimmedTag = tag.trim();
        if (this.currentNote.tags.includes(trimmedTag)) {
            showNotification('Tag já existe', 'warning');
            return;
        }

        this.currentNote.tags.push(trimmedTag);
        this.displayNoteEditor();
        tagInput.value = '';
    }

    removeTag(tag) {
        if (!this.currentNote) return;

        this.currentNote.tags = this.currentNote.tags.filter(t => t !== tag);
        this.displayNoteEditor();
    }

    async addAttachment() {
        if (!this.currentNote) return;

        // Implementar lógica de adicionar anexo
        showNotification('Funcionalidade em desenvolvimento', 'info');
    }

    removeAttachment(attachmentId) {
        if (!this.currentNote) return;

        this.currentNote.attachments = this.currentNote.attachments.filter(a => a.id !== attachmentId);
        this.displayNoteEditor();
    }

    toggleSearch() {
        const searchPanel = document.querySelector('.search-panel');
        const editor = document.querySelector('.note-editor');
        if (!searchPanel || !editor) return;

        if (searchPanel.style.display === 'none') {
            searchPanel.style.display = 'block';
            editor.style.display = 'none';
        } else {
            searchPanel.style.display = 'none';
        }
    }

    handleSearch() {
        const searchInput = document.querySelector('.search-input');
        if (!searchInput) return;

        const query = searchInput.value.toLowerCase();
        const results = this.notes.filter(note => 
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            note.tags.some(tag => tag.toLowerCase().includes(query))
        );

        this.displaySearchResults(results);
    }

    displaySearchResults(results) {
        const searchResults = document.querySelector('.search-results');
        if (!searchResults) return;

        searchResults.innerHTML = results.map(note => `
            <div class="note-item" data-id="${note.id}">
                <div class="note-header">
                    <h4>${note.title}</h4>
                    <span class="note-date">${this.formatDate(note.updatedAt)}</span>
                </div>
                <div class="note-preview">
                    ${this.truncateText(note.content, 150)}
                </div>
                <div class="note-tags">
                    ${note.tags.map(tag => `
                        <span class="tag">${tag}</span>
                    `).join('')}
                </div>
            </div>
        `).join('');

        // Adiciona listeners para os resultados
        this.setupNotesListeners();
    }

    handleTitleChange() {
        if (!this.currentNote) return;

        const titleInput = document.querySelector('.note-title');
        if (titleInput) {
            this.currentNote.title = titleInput.value;
            this.currentNote.updatedAt = new Date().toISOString();
        }
    }

    handleContentChange() {
        if (!this.currentNote) return;

        const contentTextarea = document.querySelector('.note-content');
        if (contentTextarea) {
            this.currentNote.content = contentTextarea.value;
            this.currentNote.updatedAt = new Date().toISOString();
        }
    }

    handleToolbarAction(action) {
        const contentTextarea = document.querySelector('.note-content');
        if (!contentTextarea) return;

        const start = contentTextarea.selectionStart;
        const end = contentTextarea.selectionEnd;
        const text = contentTextarea.value;
        const selectedText = text.substring(start, end);

        let newText = '';
        switch (action) {
            case 'Negrito':
                newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
                break;
            case 'Itálico':
                newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
                break;
            case 'Lista':
                newText = text.substring(0, start) + `\n- ${selectedText}` + text.substring(end);
                break;
            case 'Citação':
                newText = text.substring(0, start) + `> ${selectedText}` + text.substring(end);
                break;
        }

        contentTextarea.value = newText;
        contentTextarea.focus();
    }

    hideNoteEditor() {
        const editor = document.querySelector('.note-editor');
        if (editor) {
            editor.style.display = 'none';
        }
    }

    getAttachmentIcon(type) {
        switch (type) {
            case 'image':
                return 'image';
            case 'document':
                return 'description';
            case 'link':
                return 'link';
            default:
                return 'attach_file';
        }
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // Métodos de simulação de API
    async fetchNotes() {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));

        // Retorna dados simulados
        return [
            {
                id: '1',
                title: 'Notas sobre João 1',
                content: 'No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus...',
                tags: ['bíblia', 'evangelho', 'joão'],
                attachments: [
                    {
                        id: '1',
                        name: 'imagem.jpg',
                        type: 'image'
                    }
                ],
                createdAt: '2024-01-15T19:00:00Z',
                updatedAt: '2024-01-15T19:00:00Z'
            },
            {
                id: '2',
                title: 'Ideias para Sermão',
                content: 'Pensamentos sobre o amor de Deus...',
                tags: ['sermão', 'amor'],
                attachments: [],
                createdAt: '2024-01-16T10:00:00Z',
                updatedAt: '2024-01-16T10:00:00Z'
            }
        ];
    }

    async saveNoteToServer(note) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }

    async deleteNoteFromServer(noteId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }
}

// Exporta uma única instância
export const studyNotes = new StudyNotesManager(); 
export const studyNotes = new StudyNotesManager(); 