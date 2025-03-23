import { STUDY_CONFIG } from './config.js';
import { showNotification } from './common.js';
import { userProgress } from './user-progress.js';

class StudyContentManager {
    constructor() {
        this.currentContent = null;
        this.currentStudy = null;
        this.contentHistory = [];
        this.isInitialized = false;
    }

    initialize() {
        this.setupContentUI();
        this.setupEventListeners();
        this.isInitialized = true;
    }

    setupContentUI() {
        const contentSection = document.querySelector('.study-content');
        if (!contentSection) return;

        contentSection.innerHTML = `
            <div class="content-container">
                <div class="content-header">
                    <h3 class="content-title"></h3>
                    <div class="content-actions">
                        <button class="btn btn-icon" id="prevContent">
                            <span class="material-icons">arrow_back</span>
                        </button>
                        <button class="btn btn-icon" id="nextContent">
                            <span class="material-icons">arrow_forward</span>
                        </button>
                    </div>
                </div>

                <div class="content-body">
                    <div class="content-text"></div>
                    <div class="content-notes">
                        <textarea placeholder="Adicione suas notas aqui..."></textarea>
                    </div>
                </div>

                <div class="content-footer">
                    <button class="btn btn-primary" id="completeContent">
                        Marcar como Concluído
                    </button>
                    <button class="btn btn-secondary" id="saveNotes">
                        Salvar Notas
                    </button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Botões de navegação
        const prevContentBtn = document.getElementById('prevContent');
        if (prevContentBtn) {
            prevContentBtn.addEventListener('click', () => this.navigateContent(-1));
        }

        const nextContentBtn = document.getElementById('nextContent');
        if (nextContentBtn) {
            nextContentBtn.addEventListener('click', () => this.navigateContent(1));
        }

        // Botões de ação
        const completeContentBtn = document.getElementById('completeContent');
        if (completeContentBtn) {
            completeContentBtn.addEventListener('click', () => this.completeContent());
        }

        const saveNotesBtn = document.getElementById('saveNotes');
        if (saveNotesBtn) {
            saveNotesBtn.addEventListener('click', () => this.saveNotes());
        }
    }

    async loadContent(studyId, contentId) {
        try {
            const content = await this.fetchContent(studyId, contentId);
            this.currentContent = content;
            this.currentStudy = await this.fetchStudy(studyId);
            this.displayContent(content);
            this.updateProgress();
        } catch (error) {
            console.error('Erro ao carregar conteúdo:', error);
            showNotification('Erro ao carregar conteúdo', 'error');
        }
    }

    displayContent(content) {
        const contentTitle = document.querySelector('.content-title');
        const contentText = document.querySelector('.content-text');
        const contentNotes = document.querySelector('.content-notes textarea');
        const completeContentBtn = document.getElementById('completeContent');

        if (contentTitle) {
            contentTitle.textContent = content.title;
        }

        if (contentText) {
            contentText.innerHTML = content.content;
        }

        if (contentNotes) {
            contentNotes.value = content.notes || '';
        }

        if (completeContentBtn) {
            completeContentBtn.textContent = content.completed ? 'Conteúdo Concluído' : 'Marcar como Concluído';
            completeContentBtn.disabled = content.completed;
        }

        // Atualiza histórico
        this.contentHistory.push({
            studyId: this.currentStudy.id,
            contentId: content.id,
            timestamp: new Date().toISOString()
        });
    }

    async navigateContent(direction) {
        if (!this.currentStudy || !this.currentContent) return;

        const currentIndex = this.currentStudy.contents.findIndex(
            content => content.id === this.currentContent.id
        );
        const newIndex = currentIndex + direction;

        if (newIndex >= 0 && newIndex < this.currentStudy.contents.length) {
            const nextContent = this.currentStudy.contents[newIndex];
            await this.loadContent(this.currentStudy.id, nextContent.id);
        }
    }

    async completeContent() {
        if (!this.currentStudy || !this.currentContent) return;

        try {
            await this.updateContentCompletion(
                this.currentStudy.id,
                this.currentContent.id,
                true
            );

            this.currentContent.completed = true;
            this.displayContent(this.currentContent);
            this.updateProgress();
            this.updateStudyList();

            showNotification('Conteúdo concluído com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao concluir conteúdo:', error);
            showNotification('Erro ao concluir conteúdo', 'error');
        }
    }

    async saveNotes() {
        if (!this.currentStudy || !this.currentContent) return;

        const notes = document.querySelector('.content-notes textarea')?.value;
        if (!notes) return;

        try {
            await this.updateContentNotes(
                this.currentStudy.id,
                this.currentContent.id,
                notes
            );

            showNotification('Notas salvas com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao salvar notas:', error);
            showNotification('Erro ao salvar notas', 'error');
        }
    }

    updateProgress() {
        if (!this.currentStudy) return;

        const totalContents = this.currentStudy.contents.length;
        const completedContents = this.currentStudy.contents.filter(
            content => content.completed
        ).length;
        const progress = (completedContents / totalContents) * 100;

        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (progressText) {
            progressText.textContent = `${Math.round(progress)}% concluído`;
        }
    }

    // Métodos de simulação de API
    async fetchStudy(studyId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));

        // Retorna dados simulados
        return {
            id: studyId,
            title: 'Estudo',
            description: 'Descrição do estudo',
            category: 'bible',
            difficulty: 'beginner',
            progress: 50,
            isFavorite: false,
            date: new Date().toISOString(),
            contents: [
                {
                    id: '1',
                    title: 'Conteúdo 1',
                    content: 'Conteúdo do estudo 1',
                    notes: '',
                    completed: false
                },
                {
                    id: '2',
                    title: 'Conteúdo 2',
                    content: 'Conteúdo do estudo 2',
                    notes: '',
                    completed: true
                }
            ]
        };
    }

    async fetchContent(studyId, contentId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));

        // Retorna dados simulados
        return {
            id: contentId,
            title: 'Conteúdo',
            content: 'Conteúdo do estudo',
            notes: '',
            completed: false
        };
    }

    async updateContentCompletion(studyId, contentId, completed) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }

    async updateContentNotes(studyId, contentId, notes) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }
}

// Exporta uma única instância
export const studyContent = new StudyContentManager(); 