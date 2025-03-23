import { STUDY_CONFIG } from './config.js';
import { showNotification } from './common.js';
import { userProgress } from './user-progress.js';

class StudyQuizManager {
    constructor() {
        this.currentQuiz = null;
        this.currentQuestion = null;
        this.quizHistory = [];
        this.isInitialized = false;
    }

    initialize() {
        this.setupQuizUI();
        this.setupEventListeners();
        this.isInitialized = true;
    }

    setupQuizUI() {
        const quizSection = document.querySelector('.study-quiz');
        if (!quizSection) return;

        quizSection.innerHTML = `
            <div class="quiz-container">
                <div class="quiz-header">
                    <h3 class="quiz-title"></h3>
                    <div class="quiz-progress">
                        <span class="progress-text">Questão <span id="currentQuestion">0</span> de <span id="totalQuestions">0</span></span>
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                    </div>
                </div>

                <div class="quiz-content">
                    <div class="question-container">
                        <div class="question-text"></div>
                        <div class="question-options">
                            <!-- Opções serão preenchidas dinamicamente -->
                        </div>
                    </div>

                    <div class="quiz-navigation">
                        <button class="btn btn-secondary" id="prevQuestion" disabled>
                            <span class="material-icons">arrow_back</span>
                            Anterior
                        </button>
                        <button class="btn btn-primary" id="nextQuestion">
                            Próxima
                            <span class="material-icons">arrow_forward</span>
                        </button>
                    </div>
                </div>

                <div class="quiz-summary" style="display: none;">
                    <h4>Resumo do Questionário</h4>
                    <div class="summary-stats">
                        <div class="stat-item">
                            <span class="stat-label">Total de Questões</span>
                            <span class="stat-value" id="totalQuestionsSummary">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Acertos</span>
                            <span class="stat-value" id="correctAnswers">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Erros</span>
                            <span class="stat-value" id="wrongAnswers">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Pontuação</span>
                            <span class="stat-value" id="quizScore">0%</span>
                        </div>
                    </div>
                    <div class="summary-actions">
                        <button class="btn btn-primary" id="reviewQuiz">
                            Revisar Respostas
                        </button>
                        <button class="btn btn-secondary" id="restartQuiz">
                            Tentar Novamente
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Botões de navegação
        const prevQuestionBtn = document.getElementById('prevQuestion');
        if (prevQuestionBtn) {
            prevQuestionBtn.addEventListener('click', () => this.navigateQuestion(-1));
        }

        const nextQuestionBtn = document.getElementById('nextQuestion');
        if (nextQuestionBtn) {
            nextQuestionBtn.addEventListener('click', () => this.navigateQuestion(1));
        }

        // Botões do resumo
        const reviewQuizBtn = document.getElementById('reviewQuiz');
        if (reviewQuizBtn) {
            reviewQuizBtn.addEventListener('click', () => this.reviewQuiz());
        }

        const restartQuizBtn = document.getElementById('restartQuiz');
        if (restartQuizBtn) {
            restartQuizBtn.addEventListener('click', () => this.restartQuiz());
        }
    }

    async loadQuiz(studyId, quizId) {
        try {
            const quiz = await this.fetchQuiz(studyId, quizId);
            this.currentQuiz = quiz;
            this.currentQuestion = 0;
            this.displayQuestion();
            this.updateProgress();
        } catch (error) {
            console.error('Erro ao carregar questionário:', error);
            showNotification('Erro ao carregar questionário', 'error');
        }
    }

    displayQuestion() {
        if (!this.currentQuiz || !this.currentQuiz.questions[this.currentQuestion]) return;

        const question = this.currentQuiz.questions[this.currentQuestion];
        const questionText = document.querySelector('.question-text');
        const questionOptions = document.querySelector('.question-options');
        const currentQuestionSpan = document.getElementById('currentQuestion');
        const totalQuestionsSpan = document.getElementById('totalQuestions');
        const prevQuestionBtn = document.getElementById('prevQuestion');
        const nextQuestionBtn = document.getElementById('nextQuestion');

        // Atualiza texto da questão
        if (questionText) {
            questionText.textContent = question.text;
        }

        // Atualiza opções
        if (questionOptions) {
            questionOptions.innerHTML = question.options.map((option, index) => `
                <div class="option-item ${option.selected ? 'selected' : ''} ${option.correct !== undefined ? (option.correct ? 'correct' : 'wrong') : ''}"
                     data-index="${index}">
                    <span class="option-text">${option.text}</span>
                    ${option.correct !== undefined ? `
                        <span class="option-icon material-icons">
                            ${option.correct ? 'check_circle' : 'cancel'}
                        </span>
                    ` : ''}
                </div>
            `).join('');
        }

        // Atualiza contadores
        if (currentQuestionSpan) {
            currentQuestionSpan.textContent = this.currentQuestion + 1;
        }
        if (totalQuestionsSpan) {
            totalQuestionsSpan.textContent = this.currentQuiz.questions.length;
        }

        // Atualiza botões de navegação
        if (prevQuestionBtn) {
            prevQuestionBtn.disabled = this.currentQuestion === 0;
        }
        if (nextQuestionBtn) {
            nextQuestionBtn.textContent = this.currentQuestion === this.currentQuiz.questions.length - 1 ? 'Finalizar' : 'Próxima';
        }

        // Adiciona listeners para as opções
        this.setupOptionListeners();
    }

    setupOptionListeners() {
        const options = document.querySelectorAll('.option-item');
        options.forEach(option => {
            option.addEventListener('click', () => {
                if (this.currentQuiz.questions[this.currentQuestion].correct !== undefined) return;
                this.selectOption(parseInt(option.dataset.index));
            });
        });
    }

    selectOption(optionIndex) {
        const question = this.currentQuiz.questions[this.currentQuestion];
        if (!question || question.correct !== undefined) return;

        // Remove seleção anterior
        question.options.forEach(option => option.selected = false);

        // Marca nova seleção
        question.options[optionIndex].selected = true;

        // Atualiza UI
        this.displayQuestion();
    }

    async navigateQuestion(direction) {
        if (!this.currentQuiz) return;

        const newIndex = this.currentQuestion + direction;
        if (newIndex >= 0 && newIndex < this.currentQuiz.questions.length) {
            this.currentQuestion = newIndex;
            this.displayQuestion();
        } else if (newIndex >= this.currentQuiz.questions.length) {
            await this.finishQuiz();
        }
    }

    async finishQuiz() {
        if (!this.currentQuiz) return;

        try {
            // Calcula resultados
            const results = this.calculateResults();

            // Salva resultados
            await this.saveQuizResults(this.currentQuiz.id, results);

            // Atualiza histórico
            this.quizHistory.push({
                quizId: this.currentQuiz.id,
                results,
                date: new Date().toISOString()
            });

            // Exibe resumo
            this.displaySummary(results);

            showNotification('Questionário concluído com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao finalizar questionário:', error);
            showNotification('Erro ao finalizar questionário', 'error');
        }
    }

    calculateResults() {
        const totalQuestions = this.currentQuiz.questions.length;
        const correctAnswers = this.currentQuiz.questions.filter(
            question => question.options.find(option => option.selected)?.correct
        ).length;

        return {
            totalQuestions,
            correctAnswers,
            wrongAnswers: totalQuestions - correctAnswers,
            score: (correctAnswers / totalQuestions) * 100
        };
    }

    displaySummary(results) {
        const quizContent = document.querySelector('.quiz-content');
        const quizSummary = document.querySelector('.quiz-summary');

        if (quizContent) {
            quizContent.style.display = 'none';
        }

        if (quizSummary) {
            quizSummary.style.display = 'block';

            // Atualiza estatísticas
            document.getElementById('totalQuestionsSummary').textContent = results.totalQuestions;
            document.getElementById('correctAnswers').textContent = results.correctAnswers;
            document.getElementById('wrongAnswers').textContent = results.wrongAnswers;
            document.getElementById('quizScore').textContent = `${Math.round(results.score)}%`;
        }
    }

    async reviewQuiz() {
        this.currentQuestion = 0;
        this.displayQuestion();

        const quizContent = document.querySelector('.quiz-content');
        const quizSummary = document.querySelector('.quiz-summary');

        if (quizContent) {
            quizContent.style.display = 'block';
        }

        if (quizSummary) {
            quizSummary.style.display = 'none';
        }
    }

    async restartQuiz() {
        // Reseta o questionário
        this.currentQuiz.questions.forEach(question => {
            question.options.forEach(option => {
                option.selected = false;
                option.correct = undefined;
            });
        });

        this.currentQuestion = 0;
        this.displayQuestion();

        const quizContent = document.querySelector('.quiz-content');
        const quizSummary = document.querySelector('.quiz-summary');

        if (quizContent) {
            quizContent.style.display = 'block';
        }

        if (quizSummary) {
            quizSummary.style.display = 'none';
        }
    }

    updateProgress() {
        if (!this.currentQuiz) return;

        const progress = ((this.currentQuestion + 1) / this.currentQuiz.questions.length) * 100;
        const progressFill = document.querySelector('.progress-fill');

        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    // Métodos de simulação de API
    async fetchQuiz(studyId, quizId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));

        // Retorna dados simulados
        return {
            id: quizId,
            title: 'Questionário',
            questions: [
                {
                    text: 'Pergunta 1',
                    options: [
                        { text: 'Opção 1', selected: false, correct: true },
                        { text: 'Opção 2', selected: false, correct: false },
                        { text: 'Opção 3', selected: false, correct: false },
                        { text: 'Opção 4', selected: false, correct: false }
                    ]
                },
                {
                    text: 'Pergunta 2',
                    options: [
                        { text: 'Opção 1', selected: false, correct: false },
                        { text: 'Opção 2', selected: false, correct: true },
                        { text: 'Opção 3', selected: false, correct: false },
                        { text: 'Opção 4', selected: false, correct: false }
                    ]
                }
            ]
        };
    }

    async saveQuizResults(quizId, results) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }
}

// Exporta uma única instância
export const studyQuiz = new StudyQuizManager(); 