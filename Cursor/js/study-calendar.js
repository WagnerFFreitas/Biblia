import { STUDY_CONFIG } from './config.js';
import { showNotification } from './common.js';
import { userProgress } from './user-progress.js';

class StudyCalendarManager {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.events = [];
        this.isInitialized = false;
    }

    initialize() {
        this.setupCalendarUI();
        this.setupEventListeners();
        this.loadEvents();
        this.isInitialized = true;
    }

    setupCalendarUI() {
        const calendarSection = document.querySelector('.study-calendar');
        if (!calendarSection) return;

        calendarSection.innerHTML = `
            <div class="calendar-container">
                <div class="calendar-header">
                    <h3>Calendário de Estudos</h3>
                    <div class="calendar-actions">
                        <button class="btn btn-icon" id="addEvent">
                            <span class="material-icons">add</span>
                        </button>
                        <button class="btn btn-icon" id="filterCalendar">
                            <span class="material-icons">filter_list</span>
                        </button>
                    </div>
                </div>

                <div class="calendar-content">
                    <div class="calendar-filters" style="display: none;">
                        <select id="eventType">
                            <option value="all">Todos os Tipos</option>
                            <option value="bible">Bíblia</option>
                            <option value="church">Igreja</option>
                            <option value="doctrine">Doutrina</option>
                        </select>
                        <select id="eventStatus">
                            <option value="all">Todos os Status</option>
                            <option value="active">Ativo</option>
                            <option value="completed">Concluído</option>
                            <option value="planned">Planejado</option>
                        </select>
                    </div>

                    <div class="calendar-grid">
                        <div class="calendar-nav">
                            <button class="btn btn-icon" id="prevMonth">
                                <span class="material-icons">chevron_left</span>
                            </button>
                            <h4 class="current-month"></h4>
                            <button class="btn btn-icon" id="nextMonth">
                                <span class="material-icons">chevron_right</span>
                            </button>
                        </div>

                        <div class="calendar-days">
                            <div class="weekday">Dom</div>
                            <div class="weekday">Seg</div>
                            <div class="weekday">Ter</div>
                            <div class="weekday">Qua</div>
                            <div class="weekday">Qui</div>
                            <div class="weekday">Sex</div>
                            <div class="weekday">Sáb</div>
                        </div>

                        <div class="calendar-grid-days">
                            <!-- Dias do calendário serão preenchidos dinamicamente -->
                        </div>
                    </div>

                    <div class="event-details" style="display: none;">
                        <div class="details-header">
                            <h4 class="event-title"></h4>
                            <div class="details-actions">
                                <button class="btn btn-icon" id="editEvent">
                                    <span class="material-icons">edit</span>
                                </button>
                                <button class="btn btn-icon" id="deleteEvent">
                                    <span class="material-icons">delete</span>
                                </button>
                            </div>
                        </div>

                        <div class="details-content">
                            <div class="event-info">
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
                                    <span class="info-label">Duração</span>
                                    <span class="info-value duration"></span>
                                </div>
                            </div>

                            <div class="event-description">
                                <h5>Descrição</h5>
                                <p class="description-text"></p>
                            </div>

                            <div class="event-tasks">
                                <h5>Tarefas</h5>
                                <div class="tasks-list">
                                    <!-- Lista de tarefas será preenchida dinamicamente -->
                                </div>
                                <button class="btn btn-secondary" id="addTask">
                                    Adicionar Tarefa
                                </button>
                            </div>

                            <div class="event-notes">
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
        const addEventBtn = document.getElementById('addEvent');
        if (addEventBtn) {
            addEventBtn.addEventListener('click', () => this.addEvent());
        }

        const filterCalendarBtn = document.getElementById('filterCalendar');
        if (filterCalendarBtn) {
            filterCalendarBtn.addEventListener('click', () => this.toggleFilters());
        }

        const editEventBtn = document.getElementById('editEvent');
        if (editEventBtn) {
            editEventBtn.addEventListener('click', () => this.editEvent());
        }

        const deleteEventBtn = document.getElementById('deleteEvent');
        if (deleteEventBtn) {
            deleteEventBtn.addEventListener('click', () => this.deleteEvent());
        }

        const addTaskBtn = document.getElementById('addTask');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => this.addTask());
        }

        // Navegação do calendário
        const prevMonthBtn = document.getElementById('prevMonth');
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => this.navigateMonth(-1));
        }

        const nextMonthBtn = document.getElementById('nextMonth');
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => this.navigateMonth(1));
        }

        // Filtros
        const eventType = document.getElementById('eventType');
        if (eventType) {
            eventType.addEventListener('change', () => this.applyFilters());
        }

        const eventStatus = document.getElementById('eventStatus');
        if (eventStatus) {
            eventStatus.addEventListener('change', () => this.applyFilters());
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

    async loadEvents() {
        try {
            const savedEvents = await this.fetchEvents();
            this.events = savedEvents;
            this.updateCalendar();
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
            showNotification('Erro ao carregar eventos', 'error');
        }
    }

    updateCalendar() {
        const currentMonthElement = document.querySelector('.current-month');
        const calendarGrid = document.querySelector('.calendar-grid-days');

        if (!currentMonthElement || !calendarGrid) return;

        // Atualiza o mês atual
        currentMonthElement.textContent = this.currentDate.toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric'
        });

        // Calcula o primeiro e último dia do mês
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startingDay = firstDay.getDay();

        // Limpa o grid
        calendarGrid.innerHTML = '';

        // Adiciona dias vazios no início
        for (let i = 0; i < startingDay; i++) {
            calendarGrid.appendChild(this.createDayElement(''));
        }

        // Adiciona os dias do mês
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            calendarGrid.appendChild(this.createDayElement(day, date));
        }
    }

    createDayElement(day, date = null) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        if (date) {
            const eventsForDay = this.getEventsForDate(date);
            const isToday = this.isToday(date);
            const isSelected = this.selectedDate && this.isSameDate(date, this.selectedDate);

            if (isToday) {
                dayElement.classList.add('today');
            }

            if (isSelected) {
                dayElement.classList.add('selected');
            }

            if (eventsForDay.length > 0) {
                dayElement.classList.add('has-events');
                dayElement.innerHTML = `
                    <span class="day-number">${day}</span>
                    <div class="event-indicators">
                        ${eventsForDay.map(event => `
                            <span class="event-dot ${event.type}"></span>
                        `).join('')}
                    </div>
                `;
            } else {
                dayElement.innerHTML = `<span class="day-number">${day}</span>`;
            }

            dayElement.addEventListener('click', () => this.selectDate(date));
        }

        return dayElement;
    }

    selectDate(date) {
        this.selectedDate = date;
        this.updateCalendar();
        this.displayEventsForDate(date);
    }

    displayEventsForDate(date) {
        const events = this.getEventsForDate(date);
        const details = document.querySelector('.event-details');

        if (!details) return;

        if (events.length === 0) {
            details.style.display = 'none';
            return;
        }

        // Por enquanto, mostra apenas o primeiro evento
        const event = events[0];
        details.style.display = 'block';

        // Preenche informações
        const titleElement = details.querySelector('.event-title');
        const typeElement = details.querySelector('.type');
        const statusElement = details.querySelector('.status');
        const dateElement = details.querySelector('.date');
        const timeElement = details.querySelector('.time');
        const durationElement = details.querySelector('.duration');
        const descriptionElement = details.querySelector('.description-text');
        const tasksList = details.querySelector('.tasks-list');
        const notesList = details.querySelector('.notes-list');

        if (titleElement) {
            titleElement.textContent = event.title;
        }

        if (typeElement) {
            typeElement.textContent = event.type;
        }

        if (statusElement) {
            statusElement.textContent = event.status;
        }

        if (dateElement) {
            dateElement.textContent = this.formatDate(event.date);
        }

        if (timeElement) {
            timeElement.textContent = this.formatTime(event.time);
        }

        if (durationElement) {
            durationElement.textContent = event.duration;
        }

        if (descriptionElement) {
            descriptionElement.textContent = event.description;
        }

        if (tasksList) {
            tasksList.innerHTML = event.tasks.map(task => `
                <div class="task-item">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} 
                           onchange="studyCalendar.toggleTask('${event.id}', '${task.id}')">
                    <span class="task-text">${task.text}</span>
                </div>
            `).join('');
        }

        if (notesList) {
            notesList.innerHTML = event.notes.map(note => `
                <div class="note-item">
                    <div class="note-header">
                        <span class="note-date">${this.formatDate(note.date)}</span>
                        <button class="btn btn-icon" onclick="studyCalendar.deleteNote('${event.id}', '${note.id}')">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                    <div class="note-text">${note.text}</div>
                </div>
            `).join('');
        }
    }

    getEventsForDate(date) {
        return this.events.filter(event => {
            const eventDate = new Date(event.date);
            return this.isSameDate(eventDate, date);
        });
    }

    isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    isToday(date) {
        const today = new Date();
        return this.isSameDate(date, today);
    }

    async addEvent() {
        // Implementar lógica de adicionar evento
        showNotification('Funcionalidade em desenvolvimento', 'info');
    }

    async editEvent() {
        if (!this.selectedDate) return;

        // Implementar lógica de editar evento
        showNotification('Funcionalidade em desenvolvimento', 'info');
    }

    async deleteEvent() {
        if (!this.selectedDate) return;

        if (!confirm('Tem certeza que deseja excluir este evento?')) {
            return;
        }

        try {
            const events = this.getEventsForDate(this.selectedDate);
            if (events.length === 0) return;

            const event = events[0];
            await this.deleteEventFromServer(event.id);
            this.events = this.events.filter(e => e.id !== event.id);
            this.updateCalendar();
            this.displayEventsForDate(this.selectedDate);

            showNotification('Evento excluído com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao excluir evento:', error);
            showNotification('Erro ao excluir evento', 'error');
        }
    }

    async addTask() {
        if (!this.selectedDate) return;

        // Implementar lógica de adicionar tarefa
        showNotification('Funcionalidade em desenvolvimento', 'info');
    }

    async toggleTask(eventId, taskId) {
        try {
            const event = this.events.find(e => e.id === eventId);
            if (!event) return;

            const task = event.tasks.find(t => t.id === taskId);
            if (!task) return;

            task.completed = !task.completed;
            await this.updateEventOnServer(event);
            this.displayEventsForDate(this.selectedDate);

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
        if (!this.selectedDate || !text.trim()) return;

        try {
            const events = this.getEventsForDate(this.selectedDate);
            if (events.length === 0) return;

            const event = events[0];
            const note = {
                id: Date.now().toString(),
                text: text.trim(),
                date: new Date().toISOString()
            };

            event.notes.push(note);
            await this.updateEventOnServer(event);

            // Limpa o campo de nota
            const textarea = document.querySelector('.note-form textarea');
            if (textarea) {
                textarea.value = '';
            }

            // Atualiza a lista de notas
            this.displayEventsForDate(this.selectedDate);

            showNotification('Nota adicionada com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao adicionar nota:', error);
            showNotification('Erro ao adicionar nota', 'error');
        }
    }

    async deleteNote(eventId, noteId) {
        if (!this.selectedDate) return;

        if (!confirm('Tem certeza que deseja excluir esta nota?')) {
            return;
        }

        try {
            const event = this.events.find(e => e.id === eventId);
            if (!event) return;

            event.notes = event.notes.filter(n => n.id !== noteId);
            await this.updateEventOnServer(event);
            this.displayEventsForDate(this.selectedDate);

            showNotification('Nota excluída com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao excluir nota:', error);
            showNotification('Erro ao excluir nota', 'error');
        }
    }

    toggleFilters() {
        const filters = document.querySelector('.calendar-filters');
        if (!filters) return;

        filters.style.display = filters.style.display === 'none' ? 'block' : 'none';
    }

    applyFilters() {
        const type = document.getElementById('eventType')?.value;
        const status = document.getElementById('eventStatus')?.value;

        let filteredEvents = [...this.events];

        // Aplica filtros
        if (type && type !== 'all') {
            filteredEvents = filteredEvents.filter(event => event.type === type);
        }

        if (status && status !== 'all') {
            filteredEvents = filteredEvents.filter(event => event.status === status);
        }

        this.events = filteredEvents;
        this.updateCalendar();
    }

    navigateMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.updateCalendar();
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
    async fetchEvents() {
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
                duration: '1 hora',
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
                duration: '30 minutos',
                description: 'Reunião de oração com o grupo',
                tasks: [],
                notes: []
            }
        ];
    }

    async updateEventOnServer(event) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }

    async deleteEventFromServer(eventId) {
        // Simula uma chamada à API
        await new Promise(resolve => setTimeout(resolve, 300));
        return { success: true };
    }
}

// Exporta uma única instância
export const studyCalendar = new StudyCalendarManager();
 