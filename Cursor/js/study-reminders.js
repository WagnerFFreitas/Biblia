import { STUDY_CONFIG } from './config.js';
import { showNotification } from './common.js';
import { userProgress } from './user-progress.js';

class StudyRemindersManager {
    constructor() {
        this.reminders = [];
        this.currentReminder = null;
        this.isInitialized = false;
    }

    initialize() {
        this.setupRemindersUI();
        this.setupEventListeners();
        this.loadReminders();
        this.isInitialized = true;
    }

    setupRemindersUI() {
        const remindersSection = document.querySelector('.study-reminders');
        if (!remindersSection) return;

        remindersSection.innerHTML = `
            <div class="reminders-container">
                <div class="reminders-header">
                    <h3>Lembretes</h3>
                    <div class="reminders-actions">
                        <button class="btn btn-icon" id="addReminder">
                            <span class="material-icons">add</span>
                        </button>
                        <button class="btn btn-icon" id="filterReminders">
                            <span class="material-icons">filter_list</span>
                        </button>
                    </div>
                </div>

                <div class="reminders-content">
                    <div class="reminders-filters" style="display: none;">
                        <select id="reminderType">
                            <option value="all">Todos os Tipos</option>
                            <option value="bible">Bíblia</option>
                            <option value="church">Igreja</option>
                            <option value="doctrine">Doutrina</option>
                        </select>
                        <select id="reminderStatus">
                            <option value="all">Todos os Status</option>
                            <option value="active">Ativo</option>
                            <option value="completed">Concluído</option>
                            <option value="overdue">Atrasado</option>
                        </select>
                        <select id="reminderSort">
                            <option value="date">Data</option>
                            <option value="priority">Prioridade</option>
                            <option value="title">Título</option>
                        </select>
                    </div>

                    <div class="reminders-list">
                        <!-- Lista de lembretes será preenchida dinamicamente -->
                    </div>

                    <div class="reminder-details" style="display: none;">
                        <div class="details-header">
                            <h4 class="reminder-title"></h4>
                            <div class="details-actions">
                                <button class="btn btn-icon" id="editReminder">
                                    <span class="material-icons">edit</span>
                                </button>
                                <button class="btn btn-icon" id="deleteReminder">
                                    <span class="material-icons">delete</span>
                                </button>
                            </div>
                        </div>

                        <div class="details-content">
                            <div class="reminder-info">
                                <div class="info-item">
                                    <span class="info-label">Tipo</span>
                                    <span class="info-value type"></span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Status</span>
                                    <span class="info-value status"></span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Data</span>
                                    <span class="info-value date"></span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Hora</span>
                                    <span class="info-value time"></span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Prioridade</span>
                                    <span class="info-value priority"></span>
                                </div>
                            </div>

                            <div class="reminder-description">
                                <h5>Descrição</h5>
                                <p class="description-text"></p>
                            </div>

                            <div class="reminder-tasks">
                                <h5>Tarefas</h5>
                                <div class="tasks-list">
                                    <!-- Lista de tarefas será preenchida dinamicamente -->
                                </div>
                                <button class="btn btn-secondary" id="addTask">
                                    Adicionar Tarefa
                                </button>
                            </div>

                            <div class="reminder-notes">
                                <h5>Notas</h5>
                                <div class="notes-list">
                                    <!-- Lista de notas será preenchida dinamicamente -->
                                </div>
                                <div class="note-form">
                                    <textarea placeholder="Adicione uma nota..."></textarea>
                                    <button class="btn btn-primary">Adicionar Nota</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Botões de ação
        const addReminderBtn = document.getElementById('addReminder');
        if (addReminderBtn) {
            addReminderBtn.addEventListener('click', () => this.addReminder());
        }

        const filterRemindersBtn = document.getElementById('filterReminders');
        if (filterRemindersBtn) {
            filterRemindersBtn.addEventListener('click', () => this.toggleFilters());
        }

        const editReminderBtn = document.getElementById('editReminder');
        if (editReminderBtn) {
            editReminderBtn.addEventListener('click', () => this.editReminder());
        }

        const deleteReminderBtn = document.getElementById('deleteReminder');
        if (deleteReminderBtn) {
            deleteReminderBtn.addEventListener('click', () => this.deleteReminder());
        }

        const addTaskBtn = document.getElementById('addTask');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => this.addTask());
        }

        // Filtros
        const reminderType = document.getElementById('reminderType');
        if (reminderType) {
            reminderType.addEventListener('change', () => this.applyFilters());
        }

        const reminderStatus = document.getElementById('reminderStatus');
        if (reminderStatus) {
            reminderStatus.addEventListener('change', () => this.applyFilters());
        }

        const reminderSort = document.getElementById('reminderSort');
        if (reminderSort) {
            reminderSort.addEventListener('change', () => this.applyFilters());
        }

        // Formulário de nota
        const noteForm = document.querySelector('.note-form');
        if (noteForm) {
            const textarea = noteForm.querySelector('textarea');
            const submitBtn = noteForm.querySelector('button');

            if (submitBtn) {
                submitBtn.addEventListener('click', () => this.addNote(textarea.value));
            }
        }
    }

    async loadReminders() {
        try {
            const savedReminders = await this.fetchReminders();
            this.reminders = savedReminders;
            this.displayReminders();
        } catch (error) {
            console.error('Erro ao carregar lembretes:', error);
            showNotification('Erro ao carregar lembretes', 'error');
        }
    }

    displayReminders() {
        const remindersList = document.querySelector('.reminders-list');
        if (!remindersList) return;

        remindersList.innerHTML = this.reminders.map(reminder => `
            <div class="reminder-item ${reminder.id === this.currentReminder?.id ? 'active' : ''}" 
                 data-id="${reminder.id}">
                <div class="reminder-icon">
                    <span class="material-icons">${this.getReminderIcon(reminder.type)}</span>
                </div>
                <div class="reminder-info">
                    <h4>${reminder.title}</h4>
                    <div class="reminder-meta">
                        <span class="reminder-status ${reminder.status}">${reminder.status}</span>
                        <span class="reminder-priority ${reminder.priority}">${reminder.priority}</span>
                        <span>${this.formatDate(reminder.date)} ${this.formatTime(reminder.time)}</span>
                    </div>
                    <div class="reminder-tasks-count">
                        ${reminder.tasks.length} tarefas
                    </div>
                </div>
            </div>
        `).join('');

        // Adiciona listeners para os lembretes
        this.setupRemindersListeners();
    }

    setupRemindersListeners() {
        const reminders = document.querySelectorAll('.reminder-item');
        reminders.forEach(reminder => {
            reminder.addEventListener('click', () => {
                this.viewReminder(reminder.dataset.id);
            });
        });
    }

    getReminderIcon(type) {
        switch (type) {
            case 'bible':
                return 'menu_book';
            case 'church':
                return 'church';
            case 'doctrine':
                return 'school';
            default:
                return 'notifications';
        }
    }

    viewReminder(reminderId) {
        const reminder = this.reminders.find(r => r.id === reminderId);
        if (!reminder) return;

        this.currentReminder = reminder;
        this.displayReminderDetails();
    }

    displayReminderDetails() {
        const details = document.querySelector('.reminder-details');
        if (!details) return;

        details.style.display = 'block';

        // Preenche informações
        const titleElement = details.querySelector('.reminder-title');
        const typeElement = details.querySelector('.type');
        const statusElement = details.querySelector('.status');
        const dateElement = details.querySelector('.date');
        const timeElement = details.querySelector('.time');
        const priorityElement = details.querySelector('.priority');
        const descriptionElement = details.querySelector('.description-text');
        const tasksList = details.querySelector('.tasks-list');
        const notesList = details.querySelector('.notes-list');

        if (titleElement) {
            titleElement.textContent = this.currentReminder.title;
        }

        if (typeElement) {
            typeElement.textContent = this.currentReminder.type;
        }

        if (statusElement) {
            statusElement.textContent = this.currentReminder.status;
        }

        if (dateElement) {
            dateElement.textContent = this.formatDate(this.currentReminder.date);
        }

        if (timeElement) {
            timeElement.textContent = this.formatTime(this.currentReminder.time);
        }

        if (priorityElement) {
            priorityElement.textContent = this.currentReminder.priority;
        }

        if (descriptionElement) {
            descriptionElement.textContent = this.currentReminder.description;
        }

        if (tasksList) {
            tasksList.innerHTML = this.currentReminder.tasks.map(task => `
                <div class="task-item">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} 
                           onchange="studyReminders.toggleTask('${this.currentReminder.id}', '${task.id}')">
                    <span class="task-text">${task.text}</span>
                </div>
            `).join('');
        }

        if (notesList) {
            notesList.innerHTML = this.currentReminder.notes.map(note => `
                <div class="note-item">
                    <div class="note-header">
                        <span class="note-date">${this.formatDate(note.date)}</span>
                        <button class="btn btn-icon" onclick="studyReminders.deleteNote('${this.currentReminder.id}', '${note.id}')">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                    <div class="note-text">${note.text}</div>
                </div>
            `).join('');
        }
    }

    async addReminder() {
        // Implementar lógica de adicionar lembrete
        showNotification('Funcionalidade em desenvolvimento', 'info');
    }

    async editReminder() {
        if (!this.currentReminder) return;

        // Implementar lógica de editar lembrete
        showNotification('Funcionalidade em desenvolvimento', 'info');
    }

    async deleteReminder() {
        if (!this.currentReminder) return;

        if (!confirm('Tem certeza que deseja excluir este lembrete?')) {
            return;
        }

        try {
            await this.deleteReminderFromServer(this.currentReminder.id);
            this.reminders = this.reminders.filter(r => r.id !== this.currentReminder.id);
            this.currentReminder = null;
            this.displayReminders();
            this.hideReminderDetails();

            showNotification('Lembrete excluído com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao excluir lembrete:', error);
            showNotification('Erro ao excluir lembrete', 'error');
        }
    }

    async addTask() {
        if (!this.currentReminder) return;

        // Implementar lógica de adicionar tarefa
        showNotification('Funcionalidade em desenvolvimento', 'info');
    }

    async toggleTask(reminderId, taskId) {
        try {
            const reminder = this.reminders.find(r => r.id === reminderId);
            if (!reminder) return;

            const task = reminder.tasks.find(t => t.id === taskId);
            if (!task) return;

            task.completed = !task.completed;
            await this.updateReminderOnServer(reminder);
            this.displayReminderDetails();

            showNotification(
                task.completed ? 'Tarefa concluída' : 'Tarefa reativada',
                'success'
            );
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            showNotification('Erro ao atualizar tarefa', 'error');
        }
    }

    async addNote(text) {
        if (!this.currentReminder || !text.trim()) return;

        try {
            const note = {
                id: Date.now().toString(),
                text: text.trim(),
                date: new Date().toISOString()
            };

            this.currentReminder.notes.push(note);
            await this.updateReminderOnServer(this.currentReminder);

            // Limpa o campo de nota
            const textarea = document.querySelector('.note-form textarea');
            if (textarea) {
                textarea.value = '';
            }

            // Atualiza a lista de notas
            this.displayReminderDetails();

            showNotification('Nota adicionada com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao adicionar nota:', error);
            showNotification('Erro ao adicionar nota', 'error');
        }
    }

    async deleteNote(reminderId, noteId) {
        if (!this.currentReminder) return;

        if (!confirm('Tem certeza que deseja excluir esta nota?')) {
            return;
        }

        try {
            const reminder = this.reminders.find(r => r.id === reminderId);
            if (!reminder) return;

            reminder.notes = reminder.notes.filter(n => n.id !== noteId);
            await this.updateReminderOnServer(reminder);
            this.displayReminderDetails();

            showNotification('Nota excluída com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao excluir nota:', error);
            showNotification('Erro ao excluir nota', 'error');
        }
    }

    toggleFilters() {
        const filters = document.querySelector('.reminders-filters');
        if (!filters) return;

        filters.style.display = filters.style.display === 'none' ? 'block' : 'none';
    }

    applyFilters() {
        const type = document.getElementById('reminderType')?.value;
        const status = document.getElementById('reminderStatus')?.value;
        const sort = document.getElementById('reminderSort')?.value;

        let filteredReminders = [...this.reminders];

        // Aplica filtros
        if (type && type !== 'all') {
            filteredReminders = filteredReminders.filter(reminder => reminder.type === type);
        }

        if (status && status !== 'all') {
            filteredReminders = filteredReminders.filter(reminder => reminder.status === status);
        }

        // Aplica ordenação
        switch (sort) {
            case 'date':
                filteredReminders.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                filteredReminders.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
                break;
            case 'title':
                filteredReminders.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        this.displayFilteredReminders(filteredReminders);
    }

    displayFilteredReminders(reminders) {
        const remindersList = document.querySelector('.reminders-list');
        if (!remindersList) return;

        remindersList.innerHTML = reminders.map(reminder => `
            <div class="reminder-item ${reminder.id === this.currentReminder?.id ? 'active' : ''}" 
                 data-id="${reminder.id}">
                <div class="reminder-icon">
                    <span class="material-icons">${this.getReminderIcon(reminder.type)}</span>
                </div>
                <div class="reminder-info">
                    <h4>${reminder.title}</h4>
                    <div class="reminder-meta">
                        <span class="reminder-status ${reminder.status}">${reminder.status}</span>
                        <span class="reminder-priority ${reminder.priority}">${reminder.priority}</span>
                        <span>${this.formatDate(reminder.date)} ${this.formatTime(reminder.time)}</span>
                    </div>
                    <div class="reminder-tasks-count">
                        ${reminder.tasks.length} tarefas
                    </div>
                </div>
            </div>
        `).join('');

        // Adiciona listeners para os lembretes
        this.setupRemindersListeners();
    }

    hideReminderDetails() {
        const details = document.querySelector('.reminder-details');
        if (details) {
            details.style.display = 'none';
        }
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    formatTime(time) {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Métodos de simulação de API
    async fetchReminders() {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));

        // Retorna dados simulados
        return [
            {
                id: '1',
                title: 'Estudo Bíblico',
                type: 'bible',
                status: 'active',
                date: '2024-01-15',
                time: '19:00',
                priority: 'high',
                description: 'Estudo bíblico sobre o livro de João',
                tasks: [
                    {
                        id: '1',
                        text: 'Ler João 1:1-18',
                        completed: true
                    },
                    {
                        id: '2',
                        text: 'Fazer resumo',
                        completed: false
                    }
                ],
                notes: [
                    {
                        id: '1',
                        text: 'Nota 1',
                        date: '2024-01-15T19:00:00Z'
                    }
                ]
            },
            {
                id: '2',
                title: 'Reunião de Oração',
                type: 'church',
                status: 'planned',
                date: '2024-01-20',
                time: '20:00',
                priority: 'medium',
                description: 'Reunião de oração com o grupo',
                tasks: [],
                notes: []
            }
        ];
    }

    async updateReminderOnServer(reminder) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }

    async deleteReminderFromServer(reminderId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }
}

// Exporta uma única instância
export const studyReminders = new StudyRemindersManager(); 