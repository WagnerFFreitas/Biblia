import { STUDY_PLANS } from './study-plans.js';
import { userProgress } from './user-progress.js';
import { STUDY_CONFIG } from './config.js';
import { showNotification } from './common.js';

class StudyUIManager {
    constructor() {
        this.currentView = 'list';
        this.currentFilter = 'all';
        this.currentSort = 'date';
        this.isInitialized = false;
        this.currentPlanSection = document.querySelector('.current-plan');
        this.plansContainer = document.querySelector('.study-plans');
        this.userInfoSection = document.querySelector('.user-info');
        
        this.initialize();
    }
    
    initialize() {
        this.renderUserInfo();
        this.renderCurrentPlan();
        this.renderStudyPlans();
        this.setupEventListeners();
        this.setupStudyUI();
        this.isInitialized = true;
    }
    
    // Renderização da interface
    renderUserInfo() {
        if (!this.userInfoSection) return;
        
        const { name, level, streak } = userProgress.data;
        
        this.userInfoSection.innerHTML = `
            <span class="material-icons avatar">account_circle</span>
            <div class="user-progress">
                <div class="level">Nível ${level}</div>
                <div class="streak">${streak} dias seguidos</div>
            </div>
        `;
    }
    
    renderCurrentPlan() {
        if (!this.currentPlanSection) return;
        
        const { currentPlan } = userProgress.data;
        
        if (!currentPlan) {
            this.currentPlanSection.innerHTML = `
                <h2>Comece um Plano de Estudo</h2>
                <p>Escolha um dos planos abaixo para começar sua jornada.</p>
            `;
            return;
        }
        
        const progress = userProgress.getPlanProgress(currentPlan.id);
        const planProgress = userProgress.data.progress[currentPlan.id];
        const completedTopics = planProgress?.completed || 0;
        const totalTopics = currentPlan.topics.length;
        
        this.currentPlanSection.innerHTML = `
            <h2>Continue Estudando</h2>
            <div class="plan-info">
                <h3>${currentPlan.name}</h3>
                <p>${completedTopics} de ${totalTopics} tópicos concluídos</p>
                <div class="progress-bar">
                    <div class="progress" style="width: ${progress}%"></div>
                </div>
            </div>
            <button class="continue-button">
                <span class="material-icons">play_arrow</span>
                Continuar
            </button>
        `;
    }
    
    renderStudyPlans() {
        if (!this.plansContainer) return;
        
        this.plansContainer.innerHTML = '';
        
        STUDY_PLANS.forEach(plan => {
            const progress = userProgress.getPlanProgress(plan.id);
            const isCurrentPlan = userProgress.data.currentPlan?.id === plan.id;
            
            const card = document.createElement('div');
            card.className = `card plan-card ${isCurrentPlan ? 'current' : ''}`;
            card.innerHTML = `
                <img src="${plan.image}" alt="${plan.name}" loading="lazy">
                <div class="card-content">
                    <h3>${plan.name}</h3>
                    <p>${plan.description}</p>
                    <div class="card-footer">
                        <div class="plan-meta">
                            <span class="duration">
                                <span class="material-icons">schedule</span>
                                ${plan.duration} dias
                            </span>
                            <span class="topics">
                                <span class="material-icons">list</span>
                                ${plan.topics.length} tópicos
                            </span>
                        </div>
                        ${this.renderPlanButton(plan, progress, isCurrentPlan)}
                    </div>
                </div>
                ${progress > 0 ? `
                    <div class="progress-bar">
                        <div class="progress" style="width: ${progress}%"></div>
                    </div>
                ` : ''}
            `;
            
            this.plansContainer.appendChild(card);
        });
    }
    
    renderPlanButton(plan, progress, isCurrentPlan) {
        if (isCurrentPlan) {
            return `
                <button class="continue-plan" data-plan-id="${plan.id}">
                    <span class="material-icons">play_arrow</span>
                    Continuar
                </button>
            `;
        }
        
        if (progress === 100) {
            return `
                <button class="review-plan" data-plan-id="${plan.id}">
                    <span class="material-icons">refresh</span>
                    Revisar
                </button>
            `;
        }
        
        if (progress > 0) {
            return `
                <button class="resume-plan" data-plan-id="${plan.id}">
                    <span class="material-icons">play_arrow</span>
                    Retomar
                </button>
            `;
        }
        
        return `
            <button class="start-plan" data-plan-id="${plan.id}">
                <span class="material-icons">add</span>
                Começar
            </button>
        `;
    }
    
    // Manipulação de eventos
    setupEventListeners() {
        // Eventos dos planos
        this.plansContainer?.addEventListener('click', e => {
            const button = e.target.closest('button[data-plan-id]');
            if (!button) return;
            
            const planId = button.dataset.planId;
            const action = button.className;
            
            switch (action) {
                case 'start-plan':
                    this.handleStartPlan(planId);
                    break;
                case 'continue-plan':
                case 'resume-plan':
                    this.handleContinuePlan(planId);
                    break;
                case 'review-plan':
                    this.handleReviewPlan(planId);
                    break;
            }
        });
        
        // Evento do botão continuar
        this.currentPlanSection?.querySelector('.continue-button')?.addEventListener('click', () => {
            if (userProgress.data.currentPlan) {
                this.handleContinuePlan(userProgress.data.currentPlan.id);
            }
        });
    }
    
    handleStartPlan(planId) {
        if (userProgress.startPlan(planId)) {
            this.renderCurrentPlan();
            this.renderStudyPlans();
            this.renderUserInfo();
        }
    }
    
    handleContinuePlan(planId) {
        const plan = STUDY_PLANS.find(p => p.id === planId);
        if (!plan) return;
        
        const progress = userProgress.data.progress[planId];
        const currentTopicIndex = progress?.completed || 0;
        
        if (currentTopicIndex >= plan.topics.length) {
            userProgress.showNotification('Você já completou este plano!', 'info');
            return;
        }
        
        const topic = plan.topics[currentTopicIndex];
        this.navigateToTopic(plan, topic);
    }
    
    handleReviewPlan(planId) {
        const plan = STUDY_PLANS.find(p => p.id === planId);
        if (!plan) return;
        
        // Implementar lógica de revisão
        userProgress.showNotification('Recurso de revisão em desenvolvimento', 'info');
    }
    
    navigateToTopic(plan, topic) {
        // Implementar navegação para o tópico
        console.log('Navegando para:', { plan, topic });
        userProgress.showNotification(`Carregando: ${topic.title}`, 'info');
    }
    
    // Atualizações da interface
    updateProgress() {
        this.renderCurrentPlan();
        this.renderStudyPlans();
        this.renderUserInfo();
    }

    setupStudyUI() {
        const studySection = document.querySelector('#study');
        if (!studySection) return;

        studySection.innerHTML = `
            <div class="study-ui-container">
                <div class="study-ui-header">
                    <div class="view-controls">
                        <button class="btn btn-icon" id="listView">
                            <span class="material-icons">view_list</span>
                        </button>
                        <button class="btn btn-icon" id="gridView">
                            <span class="material-icons">grid_view</span>
                        </button>
                        <button class="btn btn-icon" id="cardView">
                            <span class="material-icons">view_agenda</span>
                        </button>
                    </div>
                    <div class="filter-controls">
                        <select id="studyFilter">
                            <option value="all">Todos</option>
                            <option value="in-progress">Em Progresso</option>
                            <option value="completed">Concluídos</option>
                            <option value="favorites">Favoritos</option>
                        </select>
                        <select id="studySort">
                            <option value="date">Data</option>
                            <option value="title">Título</option>
                            <option value="progress">Progresso</option>
                        </select>
                    </div>
                </div>

                <div class="study-ui-content">
                    <div class="study-list">
                        <!-- Lista de estudos será preenchida dinamicamente -->
                    </div>

                    <div class="study-details">
                        <div class="study-header">
                            <h2 class="study-title"></h2>
                            <div class="study-actions">
                                <button class="btn btn-icon" id="toggleFavorite">
                                    <span class="material-icons">favorite_border</span>
                                </button>
                                <button class="btn btn-icon" id="shareStudy">
                                    <span class="material-icons">share</span>
                                </button>
                            </div>
                        </div>

                        <div class="study-progress">
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

    // Métodos de simulação de API
    async fetchStudies() {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 500));

        // Retorna dados simulados
        return [
            {
                id: '1',
                title: 'Estudo 1',
                description: 'Descrição do estudo 1',
                category: 'bible',
                difficulty: 'beginner',
                progress: 50,
                isFavorite: false,
                date: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Estudo 2',
                description: 'Descrição do estudo 2',
                category: 'doctrine',
                difficulty: 'intermediate',
                progress: 75,
                isFavorite: true,
                date: new Date().toISOString()
            }
        ];
    }

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
            date: new Date().toISOString()
        };
    }

    async updateFavoriteStatus(studyId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return true;
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
export const studyUI = new StudyUIManager(); 