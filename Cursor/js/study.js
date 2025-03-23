import CONFIG from './config.js';
import { showNotification } from './common.js';
import { userProgress } from './user-progress.js';

class StudyManager {
    constructor() {
        this.currentTopic = null;
        this.currentContent = null;
        this.isLoading = false;
    }

    initialize() {
        this.setupStudySection();
        this.setupEventListeners();
        this.loadLastTopic();
    }

    setupStudySection() {
        const studySection = document.querySelector('#study');
        if (!studySection) return;

        studySection.innerHTML = `
            <div class="study-container">
                <div class="study-header">
                    <h1>Estudo Individual</h1>
                    <div class="study-actions">
                        <button class="btn btn-primary" id="startNewStudy">
                            <span class="material-icons">add</span>
                            Novo Estudo
                        </button>
                        <button class="btn btn-secondary" id="filterTopics">
                            <span class="material-icons">filter_list</span>
                            Filtrar
                        </button>
                    </div>
                </div>

                <div class="study-content">
                    <div class="topics-grid">
                        <!-- Tópicos serão preenchidos dinamicamente -->
                    </div>

                    <div class="study-details">
                        <div class="topic-header">
                            <h2 class="topic-title"></h2>
                            <div class="topic-actions">
                                <button class="btn btn-icon" id="editTopic">
                                    <span class="material-icons">edit</span>
                                </button>
                                <button class="btn btn-icon" id="deleteTopic">
                                    <span class="material-icons">delete</span>
                                </button>
                            </div>
                        </div>

                        <div class="topic-progress">
                            <div class="progress-bar">
                                <div class="progress-fill"></div>
                            </div>
                            <span class="progress-text">0% concluído</span>
                        </div>

                        <div class="study-content">
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
                                <!-- Conteúdo será preenchido dinamicamente -->
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
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Botão de novo estudo
        const startNewStudyBtn = document.getElementById('startNewStudy');
        if (startNewStudyBtn) {
            startNewStudyBtn.addEventListener('click', () => this.showNewStudyModal());
        }

        // Botão de filtrar tópicos
        const filterTopicsBtn = document.getElementById('filterTopics');
        if (filterTopicsBtn) {
            filterTopicsBtn.addEventListener('click', () => this.showFilterModal());
        }

        // Botões de ação do tópico
        const editTopicBtn = document.getElementById('editTopic');
        if (editTopicBtn) {
            editTopicBtn.addEventListener('click', () => this.showEditTopicModal());
        }

        const deleteTopicBtn = document.getElementById('deleteTopic');
        if (deleteTopicBtn) {
            deleteTopicBtn.addEventListener('click', () => this.confirmDeleteTopic());
        }

        // Botões de navegação de conteúdo
        const prevContentBtn = document.getElementById('prevContent');
        if (prevContentBtn) {
            prevContentBtn.addEventListener('click', () => this.navigateContent(-1));
        }

        const nextContentBtn = document.getElementById('nextContent');
        if (nextContentBtn) {
            nextContentBtn.addEventListener('click', () => this.navigateContent(1));
        }

        // Botões de ação do conteúdo
        const completeContentBtn = document.getElementById('completeContent');
        if (completeContentBtn) {
            completeContentBtn.addEventListener('click', () => this.completeContent());
        }

        const saveNotesBtn = document.getElementById('saveNotes');
        if (saveNotesBtn) {
            saveNotesBtn.addEventListener('click', () => this.saveContentNotes());
        }
    }

    async loadLastTopic() {
        const lastTopic = userProgress.getStudyProgress();
        if (lastTopic) {
            await this.selectTopic(lastTopic.topicId);
            if (lastTopic.contentId) {
                await this.selectContent(lastTopic.contentId);
            }
        }
    }

    async selectTopic(topicId) {
        if (!topicId) return;

        this.isLoading = true;

        try {
            const topic = await this.fetchTopic(topicId);
            this.currentTopic = topic;
            this.displayTopic(topic);
            this.updateProgress();
            this.loadContents(topicId);
        } catch (error) {
            console.error('Erro ao carregar tópico:', error);
            showNotification('Erro ao carregar tópico', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    async selectContent(contentId) {
        if (!this.currentTopic || !contentId) return;

        this.isLoading = true;

        try {
            const content = await this.fetchContent(this.currentTopic.id, contentId);
            this.currentContent = content;
            this.displayContent(content);
            this.updateContentProgress();
        } catch (error) {
            console.error('Erro ao carregar conteúdo:', error);
            showNotification('Erro ao carregar conteúdo', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    displayTopic(topic) {
        const title = document.querySelector('.topic-title');
        if (title) {
            title.textContent = topic.title;
        }

        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        if (progressBar && progressText) {
            const progress = this.calculateTopicProgress(topic);
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${progress}% concluído`;
        }
    }

    displayContent(content) {
        const title = document.querySelector('.content-title');
        if (title) {
            title.textContent = content.title;
        }

        const contentBody = document.querySelector('.content-body');
        if (contentBody) {
            contentBody.innerHTML = content.content;
        }

        const completeBtn = document.getElementById('completeContent');
        if (completeBtn) {
            completeBtn.disabled = content.completed;
            completeBtn.textContent = content.completed ? 'Concluído' : 'Marcar como Concluído';
        }
    }

    async loadContents(topicId) {
        try {
            const contents = await this.fetchContents(topicId);
            this.displayContentsList(contents);
        } catch (error) {
            console.error('Erro ao carregar conteúdos:', error);
            showNotification('Erro ao carregar conteúdos', 'error');
        }
    }

    displayContentsList(contents) {
        const contentsList = document.querySelector('.contents-list');
        if (!contentsList) return;

        contentsList.innerHTML = contents.map(content => `
            <div class="content-item ${content.id === this.currentContent?.id ? 'active' : ''} 
                 ${content.completed ? 'completed' : ''}" 
                 data-id="${content.id}">
                <div class="content-info">
                    <span class="content-number">${content.number}</span>
                    <h3>${content.title}</h3>
                </div>
                <div class="content-status">
                    ${content.completed ? 
                        '<span class="material-icons">check_circle</span>' : 
                        '<span class="material-icons">radio_button_unchecked</span>'
                    }
                </div>
            </div>
        `).join('');

        // Adiciona eventos de clique
        contentsList.querySelectorAll('.content-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectContent(item.dataset.id);
            });
        });
    }

    calculateTopicProgress(topic) {
        if (!topic.contents || topic.contents.length === 0) return 0;
        const completedContents = topic.contents.filter(content => content.completed).length;
        return Math.round((completedContents / topic.contents.length) * 100);
    }

    updateProgress() {
        if (!this.currentTopic) return;

        const progress = this.calculateTopicProgress(this.currentTopic);
        userProgress.updateStudyProgress(this.currentTopic.id, null, progress);
    }

    updateContentProgress() {
        if (!this.currentTopic || !this.currentContent) return;

        const progress = this.calculateTopicProgress(this.currentTopic);
        userProgress.updateStudyProgress(
            this.currentTopic.id,
            this.currentContent.id,
            progress
        );
    }

    async navigateContent(direction) {
        if (!this.currentTopic || !this.currentContent) return;

        const currentIndex = this.currentTopic.contents.findIndex(
            content => content.id === this.currentContent.id
        );
        const newIndex = currentIndex + direction;

        if (newIndex >= 0 && newIndex < this.currentTopic.contents.length) {
            const nextContent = this.currentTopic.contents[newIndex];
            await this.selectContent(nextContent.id);
        }
    }

    async completeContent() {
        if (!this.currentTopic || !this.currentContent) return;

        try {
            await this.updateContentCompletion(
                this.currentTopic.id,
                this.currentContent.id,
                true
            );

            this.currentContent.completed = true;
            this.displayContent(this.currentContent);
            this.updateProgress();
            this.loadContents(this.currentTopic.id);

            showNotification('Conteúdo concluído com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao concluir conteúdo:', error);
            showNotification('Erro ao concluir conteúdo', 'error');
        }
    }

    async saveContentNotes() {
        if (!this.currentTopic || !this.currentContent) return;

        const notes = document.querySelector('.content-notes')?.value;
        if (!notes) return;

        try {
            await this.updateContentNotes(
                this.currentTopic.id,
                this.currentContent.id,
                notes
            );

            showNotification('Notas salvas com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao salvar notas:', error);
            showNotification('Erro ao salvar notas', 'error');
        }
    }

    showNewStudyModal() {
        // Implementar modal de novo estudo
    }

    showEditTopicModal() {
        // Implementar modal de edição de tópico
    }

    showFilterModal() {
        // Implementar modal de filtro
    }

    confirmDeleteTopic() {
        if (!this.currentTopic) return;

        if (confirm('Tem certeza que deseja excluir este tópico?')) {
            this.deleteTopic(this.currentTopic.id);
        }
    }

    async deleteTopic(topicId) {
        try {
            await this.removeTopic(topicId);
            this.currentTopic = null;
            this.currentContent = null;
            this.displayTopic(null);
            this.displayContent(null);
            this.loadContents(null);
            showNotification('Tópico excluído com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao excluir tópico:', error);
            showNotification('Erro ao excluir tópico', 'error');
        }
    }

    // Métodos de simulação de API
    async fetchTopic(topicId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 500));

        // Retorna dados simulados
        return {
            id: topicId,
            title: 'Tópico de Estudo',
            description: 'Descrição do tópico',
            category: 'bible',
            contents: []
        };
    }

    async fetchContents(topicId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 500));

        // Retorna dados simulados
        return [
            {
                id: '1',
                number: 1,
                title: 'Introdução',
                content: 'Conteúdo do estudo...',
                completed: false
            },
            {
                id: '2',
                number: 2,
                title: 'Desenvolvimento',
                content: 'Conteúdo do estudo...',
                completed: false
            }
        ];
    }

    async fetchContent(topicId, contentId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));

        // Retorna dados simulados
        return {
            id: contentId,
            number: parseInt(contentId),
            title: 'Introdução',
            content: 'Conteúdo do estudo...',
            completed: false
        };
    }

    async updateContentCompletion(topicId, contentId, completed) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }

    async updateContentNotes(topicId, contentId, notes) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }

    async removeTopic(topicId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }
}

// Exporta uma única instância
export const studyManager = new StudyManager(); 