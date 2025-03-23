// Planos de estudo disponíveis
export const STUDY_PLANS = [
    {
        id: 'bible-in-a-year',
        name: 'Bíblia em um Ano',
        description: 'Leia a Bíblia inteira em 365 dias',
        image: 'images/study/bible-in-a-year.jpg',
        duration: '365 dias',
        difficulty: 'médio',
        topics: [
            {
                id: 'genesis',
                name: 'Gênesis',
                description: 'O início de tudo',
                chapters: 50,
                duration: '30 dias'
            },
            {
                id: 'exodus',
                name: 'Êxodo',
                description: 'A libertação do Egito',
                chapters: 40,
                duration: '25 dias'
            },
            // ... outros livros
        ]
    },
    {
        id: 'new-testament',
        name: 'Novo Testamento',
        description: 'Estude o Novo Testamento em 90 dias',
        image: 'images/study/new-testament.jpg',
        duration: '90 dias',
        difficulty: 'fácil',
        topics: [
            {
                id: 'gospels',
                name: 'Evangelhos',
                description: 'A vida e ensinamentos de Jesus',
                chapters: 89,
                duration: '30 dias'
            },
            {
                id: 'acts',
                name: 'Atos dos Apóstolos',
                description: 'A história da igreja primitiva',
                chapters: 28,
                duration: '15 dias'
            },
            // ... outros livros
        ]
    },
    {
        id: 'wisdom-books',
        name: 'Livros de Sabedoria',
        description: 'Estude os livros de sabedoria em 60 dias',
        image: 'images/study/wisdom-books.jpg',
        duration: '60 dias',
        difficulty: 'médio',
        topics: [
            {
                id: 'proverbs',
                name: 'Provérbios',
                description: 'Sabedoria prática para a vida',
                chapters: 31,
                duration: '20 dias'
            },
            {
                id: 'ecclesiastes',
                name: 'Eclesiastes',
                description: 'O sentido da vida',
                chapters: 12,
                duration: '10 dias'
            },
            // ... outros livros
        ]
    }
];

// Conquistas disponíveis
export const ACHIEVEMENTS = {
    'first-plan': {
        id: 'first-plan',
        title: 'Primeiro Passo',
        description: 'Complete seu primeiro plano de estudo',
        icon: 'emoji_events',
        points: 100
    },
    'streak-7': {
        id: 'streak-7',
        title: 'Dedicação Semanal',
        description: 'Mantenha uma sequência de 7 dias de estudo',
        icon: 'local_fire_department',
        points: 200
    },
    'streak-30': {
        id: 'streak-30',
        title: 'Dedicação Mensal',
        description: 'Mantenha uma sequência de 30 dias de estudo',
        icon: 'stars',
        points: 500
    },
    'bible-master': {
        id: 'bible-master',
        title: 'Mestre da Bíblia',
        description: 'Complete todos os planos de estudo disponíveis',
        icon: 'military_tech',
        points: 1000
    }
};

// Níveis e pontos
export const LEVELS = {
    pointsPerLevel: 1000,
    milestones: {
        5: {
            title: 'Estudante Dedicado',
            description: 'Você está progredindo bem!',
            icon: 'school'
        },
        10: {
            title: 'Estudante Avançado',
            description: 'Continue assim!',
            icon: 'school'
        },
        20: {
            title: 'Mestre em Estudos',
            description: 'Impressionante!',
            icon: 'school'
        },
        50: {
            title: 'Sábio da Palavra',
            description: 'Você é um exemplo!',
            icon: 'school'
        }
    }
};

// Configurações de notificações
export const NOTIFICATIONS = {
    types: {
        success: {
            icon: 'check_circle',
            duration: 3000,
            color: '#4caf50'
        },
        warning: {
            icon: 'warning',
            duration: 4000,
            color: '#ff9800'
        },
        error: {
            icon: 'error',
            duration: 5000,
            color: '#f44336'
        },
        info: {
            icon: 'info',
            duration: 3000,
            color: '#2196f3'
        },
        achievement: {
            icon: 'emoji_events',
            duration: 5000,
            color: '#ffd700'
        }
    }
};

import CONFIG from './config.js';
import { showNotification } from './common.js';
import { userProgress } from './user-progress.js';

class StudyPlansManager {
    constructor() {
        this.currentPlan = null;
        this.currentLesson = null;
        this.isLoading = false;
    }

    initialize() {
        this.setupStudyPlansSection();
        this.setupEventListeners();
        this.loadLastPlan();
    }

    setupStudyPlansSection() {
        const studySection = document.querySelector('#study');
        if (!studySection) return;

        studySection.innerHTML = `
            <div class="study-container">
                <div class="study-header">
                    <h1>Planos de Estudo</h1>
                    <div class="study-actions">
                        <button class="btn btn-primary" id="createPlan">
                            <span class="material-icons">add</span>
                            Criar Plano
                        </button>
                        <button class="btn btn-secondary" id="filterPlans">
                            <span class="material-icons">filter_list</span>
                            Filtrar
                        </button>
                    </div>
                </div>

                <div class="study-content">
                    <div class="plans-grid">
                        <!-- Planos serão preenchidos dinamicamente -->
                    </div>

                    <div class="plan-details">
                        <div class="plan-header">
                            <h2 class="plan-title"></h2>
                            <div class="plan-actions">
                                <button class="btn btn-icon" id="editPlan">
                                    <span class="material-icons">edit</span>
                                </button>
                                <button class="btn btn-icon" id="deletePlan">
                                    <span class="material-icons">delete</span>
                                </button>
                            </div>
                        </div>

                        <div class="plan-progress">
                            <div class="progress-bar">
                                <div class="progress-fill"></div>
                            </div>
                            <span class="progress-text">0% concluído</span>
                        </div>

                        <div class="lessons-list">
                            <!-- Lições serão preenchidas dinamicamente -->
                        </div>

                        <div class="lesson-content">
                            <div class="lesson-header">
                                <h3 class="lesson-title"></h3>
                                <div class="lesson-actions">
                                    <button class="btn btn-icon" id="prevLesson">
                                        <span class="material-icons">arrow_back</span>
                                    </button>
                                    <button class="btn btn-icon" id="nextLesson">
                                        <span class="material-icons">arrow_forward</span>
                                    </button>
                                </div>
                            </div>

                            <div class="lesson-body">
                                <!-- Conteúdo da lição será preenchido dinamicamente -->
                            </div>

                            <div class="lesson-footer">
                                <button class="btn btn-primary" id="completeLesson">
                                    Marcar como Concluída
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
        // Botão de criar plano
        const createPlanBtn = document.getElementById('createPlan');
        if (createPlanBtn) {
            createPlanBtn.addEventListener('click', () => this.showCreatePlanModal());
        }

        // Botão de filtrar planos
        const filterPlansBtn = document.getElementById('filterPlans');
        if (filterPlansBtn) {
            filterPlansBtn.addEventListener('click', () => this.showFilterModal());
        }

        // Botões de ação do plano
        const editPlanBtn = document.getElementById('editPlan');
        if (editPlanBtn) {
            editPlanBtn.addEventListener('click', () => this.showEditPlanModal());
        }

        const deletePlanBtn = document.getElementById('deletePlan');
        if (deletePlanBtn) {
            deletePlanBtn.addEventListener('click', () => this.confirmDeletePlan());
        }

        // Botões de navegação de lições
        const prevLessonBtn = document.getElementById('prevLesson');
        if (prevLessonBtn) {
            prevLessonBtn.addEventListener('click', () => this.navigateLesson(-1));
        }

        const nextLessonBtn = document.getElementById('nextLesson');
        if (nextLessonBtn) {
            nextLessonBtn.addEventListener('click', () => this.navigateLesson(1));
        }

        // Botões de ação da lição
        const completeLessonBtn = document.getElementById('completeLesson');
        if (completeLessonBtn) {
            completeLessonBtn.addEventListener('click', () => this.completeLesson());
        }

        const saveNotesBtn = document.getElementById('saveNotes');
        if (saveNotesBtn) {
            saveNotesBtn.addEventListener('click', () => this.saveLessonNotes());
        }
    }

    async loadLastPlan() {
        const lastPlan = userProgress.getStudyProgress();
        if (lastPlan) {
            await this.selectPlan(lastPlan.planId);
            if (lastPlan.lessonId) {
                await this.selectLesson(lastPlan.lessonId);
            }
        }
    }

    async selectPlan(planId) {
        if (!planId) return;

        this.isLoading = true;

        try {
            const plan = await this.fetchPlan(planId);
            this.currentPlan = plan;
            this.displayPlan(plan);
            this.updateProgress();
            this.loadLessons(planId);
        } catch (error) {
            console.error('Erro ao carregar plano:', error);
            showNotification('Erro ao carregar plano', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    async selectLesson(lessonId) {
        if (!this.currentPlan || !lessonId) return;

        this.isLoading = true;

        try {
            const lesson = await this.fetchLesson(this.currentPlan.id, lessonId);
            this.currentLesson = lesson;
            this.displayLesson(lesson);
            this.updateLessonProgress();
        } catch (error) {
            console.error('Erro ao carregar lição:', error);
            showNotification('Erro ao carregar lição', 'error');
        } finally {
            this.isLoading = false;
        }
    }

    displayPlan(plan) {
        const title = document.querySelector('.plan-title');
        if (title) {
            title.textContent = plan.title;
        }

        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        if (progressBar && progressText) {
            const progress = this.calculatePlanProgress(plan);
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${progress}% concluído`;
        }
    }

    displayLesson(lesson) {
        const title = document.querySelector('.lesson-title');
        if (title) {
            title.textContent = lesson.title;
        }

        const content = document.querySelector('.lesson-body');
        if (content) {
            content.innerHTML = lesson.content;
        }

        const completeBtn = document.getElementById('completeLesson');
        if (completeBtn) {
            completeBtn.disabled = lesson.completed;
            completeBtn.textContent = lesson.completed ? 'Concluída' : 'Marcar como Concluída';
        }
    }

    async loadLessons(planId) {
        try {
            const lessons = await this.fetchLessons(planId);
            this.displayLessonsList(lessons);
        } catch (error) {
            console.error('Erro ao carregar lições:', error);
            showNotification('Erro ao carregar lições', 'error');
        }
    }

    displayLessonsList(lessons) {
        const lessonsList = document.querySelector('.lessons-list');
        if (!lessonsList) return;

        lessonsList.innerHTML = lessons.map(lesson => `
            <div class="lesson-item ${lesson.id === this.currentLesson?.id ? 'active' : ''} 
                 ${lesson.completed ? 'completed' : ''}" 
                 data-id="${lesson.id}">
                <div class="lesson-info">
                    <span class="lesson-number">${lesson.number}</span>
                    <h3>${lesson.title}</h3>
                </div>
                <div class="lesson-status">
                    ${lesson.completed ? 
                        '<span class="material-icons">check_circle</span>' : 
                        '<span class="material-icons">radio_button_unchecked</span>'
                    }
                </div>
            </div>
        `).join('');

        // Adiciona eventos de clique
        lessonsList.querySelectorAll('.lesson-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectLesson(item.dataset.id);
            });
        });
    }

    calculatePlanProgress(plan) {
        if (!plan.lessons || plan.lessons.length === 0) return 0;
        const completedLessons = plan.lessons.filter(lesson => lesson.completed).length;
        return Math.round((completedLessons / plan.lessons.length) * 100);
    }

    updateProgress() {
        if (!this.currentPlan) return;

        const progress = this.calculatePlanProgress(this.currentPlan);
        userProgress.updateStudyProgress(this.currentPlan.id, null, progress);
    }

    updateLessonProgress() {
        if (!this.currentPlan || !this.currentLesson) return;

        const progress = this.calculatePlanProgress(this.currentPlan);
        userProgress.updateStudyProgress(
            this.currentPlan.id,
            this.currentLesson.id,
            progress
        );
    }

    async navigateLesson(direction) {
        if (!this.currentPlan || !this.currentLesson) return;

        const currentIndex = this.currentPlan.lessons.findIndex(
            lesson => lesson.id === this.currentLesson.id
        );
        const newIndex = currentIndex + direction;

        if (newIndex >= 0 && newIndex < this.currentPlan.lessons.length) {
            const nextLesson = this.currentPlan.lessons[newIndex];
            await this.selectLesson(nextLesson.id);
        }
    }

    async completeLesson() {
        if (!this.currentPlan || !this.currentLesson) return;

        try {
            await this.updateLessonCompletion(
                this.currentPlan.id,
                this.currentLesson.id,
                true
            );

            this.currentLesson.completed = true;
            this.displayLesson(this.currentLesson);
            this.updateProgress();
            this.loadLessons(this.currentPlan.id);

            showNotification('Lição concluída com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao concluir lição:', error);
            showNotification('Erro ao concluir lição', 'error');
        }
    }

    async saveLessonNotes() {
        if (!this.currentPlan || !this.currentLesson) return;

        const notes = document.querySelector('.lesson-notes')?.value;
        if (!notes) return;

        try {
            await this.updateLessonNotes(
                this.currentPlan.id,
                this.currentLesson.id,
                notes
            );

            showNotification('Notas salvas com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao salvar notas:', error);
            showNotification('Erro ao salvar notas', 'error');
        }
    }

    showCreatePlanModal() {
        // Implementar modal de criação de plano
    }

    showEditPlanModal() {
        // Implementar modal de edição de plano
    }

    showFilterModal() {
        // Implementar modal de filtro
    }

    confirmDeletePlan() {
        if (!this.currentPlan) return;

        if (confirm('Tem certeza que deseja excluir este plano?')) {
            this.deletePlan(this.currentPlan.id);
        }
    }

    async deletePlan(planId) {
        try {
            await this.removePlan(planId);
            this.currentPlan = null;
            this.currentLesson = null;
            this.displayPlan(null);
            this.displayLesson(null);
            this.loadLessons(null);
            showNotification('Plano excluído com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao excluir plano:', error);
            showNotification('Erro ao excluir plano', 'error');
        }
    }

    // Métodos de simulação de API
    async fetchPlan(planId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 500));

        // Retorna dados simulados
        return {
            id: planId,
            title: 'Plano de Estudo Básico',
            description: 'Um plano para iniciantes na fé',
            category: 'bible',
            lessons: []
        };
    }

    async fetchLessons(planId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 500));

        // Retorna dados simulados
        return [
            {
                id: '1',
                number: 1,
                title: 'Introdução à Bíblia',
                content: 'Conteúdo da lição...',
                completed: false
            },
            {
                id: '2',
                number: 2,
                title: 'A Criação',
                content: 'Conteúdo da lição...',
                completed: false
            }
        ];
    }

    async fetchLesson(planId, lessonId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));

        // Retorna dados simulados
        return {
            id: lessonId,
            number: parseInt(lessonId),
            title: 'Introdução à Bíblia',
            content: 'Conteúdo da lição...',
            completed: false
        };
    }

    async updateLessonCompletion(planId, lessonId, completed) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }

    async updateLessonNotes(planId, lessonId, notes) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }

    async removePlan(planId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }
}

// Exporta uma única instância
export const studyPlansManager = new StudyPlansManager(); 