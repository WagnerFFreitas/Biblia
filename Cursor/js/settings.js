import { THEME_CONFIG, FONT_CONFIG, NOTIFICATION_CONFIG } from './config.js';
import { userProgress } from './user-progress.js';
import { showNotification } from './common.js';

class SettingsManager {
    constructor() {
        this.settings = {
            theme: 'system',
            fontSize: 'medium',
            notifications: true,
            reminderTime: '08:00'
        };
        this.isInitialized = false;
    }

    initialize() {
        this.loadSettings();
        this.setupEventListeners();
        this.isInitialized = true;
    }

    loadSettings() {
        const savedSettings = userProgress.getSettings();
        if (savedSettings) {
            this.settings = { ...this.settings, ...savedSettings };
        }
    }

    setupEventListeners() {
        // Listener para mudança de tema
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.setTheme(e.target.value);
            });
        }

        // Listener para mudança de tamanho de fonte
        const fontSizeSelect = document.getElementById('font-size-select');
        if (fontSizeSelect) {
            fontSizeSelect.addEventListener('change', (e) => {
                this.setFontSize(e.target.value);
            });
        }

        // Listener para toggle de notificações
        const notificationsToggle = document.getElementById('notifications-toggle');
        if (notificationsToggle) {
            notificationsToggle.addEventListener('change', (e) => {
                this.setNotifications(e.target.checked);
            });
        }

        // Listener para mudança de horário de lembrete
        const reminderTimeInput = document.getElementById('reminder-time-input');
        if (reminderTimeInput) {
            reminderTimeInput.addEventListener('change', (e) => {
                this.setReminderTime(e.target.value);
            });
        }

        // Listener para botão de salvar configurações
        const saveButton = document.getElementById('save-settings-button');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                this.saveSettings();
            });
        }

        // Listener para botão de resetar configurações
        const resetButton = document.getElementById('reset-settings-button');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetSettings();
            });
        }

        // Listener para botão de exportar dados
        const exportButton = document.getElementById('export-data-button');
        if (exportButton) {
            exportButton.addEventListener('click', () => {
                this.exportData();
            });
        }

        // Listener para botão de importar dados
        const importButton = document.getElementById('import-data-button');
        if (importButton) {
            importButton.addEventListener('click', () => {
                this.importData();
            });
        }

        // Listener para botão de limpar dados
        const clearButton = document.getElementById('clear-data-button');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearData();
            });
        }
    }

    setTheme(theme) {
        if (!THEME_CONFIG.themes[theme]) {
            showNotification('Tema não encontrado', 'error');
            return;
        }

        this.settings.theme = theme;
        this.applyTheme();
        this.saveSettings();
    }

    setFontSize(size) {
        if (!FONT_CONFIG.sizes[size]) {
            showNotification('Tamanho de fonte não encontrado', 'error');
            return;
        }

        this.settings.fontSize = size;
        this.applyFontSize();
        this.saveSettings();
    }

    setNotifications(enabled) {
        this.settings.notifications = enabled;
        this.applyNotifications();
        this.saveSettings();
    }

    setReminderTime(time) {
        if (!this.isValidTime(time)) {
            showNotification('Horário inválido', 'error');
            return;
        }

        this.settings.reminderTime = time;
        this.applyReminderTime();
        this.saveSettings();
    }

    isValidTime(time) {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time);
    }

    applyTheme() {
        const root = document.documentElement;
        const theme = this.settings.theme;

        // Remover classes de tema anteriores
        Object.keys(THEME_CONFIG.themes).forEach(t => {
            root.classList.remove(`theme-${t}`);
        });

        // Adicionar classe do tema atual
        root.classList.add(`theme-${theme}`);

        // Se o tema for 'system', verificar preferência do sistema
        if (theme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.toggle('theme-dark', prefersDark);
        }

        // Disparar evento de mudança de tema
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }

    applyFontSize() {
        const root = document.documentElement;
        const size = this.settings.fontSize;

        // Remover classes de tamanho anteriores
        Object.keys(FONT_CONFIG.sizes).forEach(s => {
            root.classList.remove(`font-size-${s}`);
        });

        // Adicionar classe do tamanho atual
        root.classList.add(`font-size-${size}`);

        // Disparar evento de mudança de tamanho de fonte
        window.dispatchEvent(new CustomEvent('fontSizeChanged', { detail: { size } }));
    }

    applyNotifications() {
        const enabled = this.settings.notifications;

        // Atualizar permissões de notificação
        if (enabled) {
            this.requestNotificationPermission();
        } else {
            this.cancelNotificationPermission();
        }

        // Disparar evento de mudança de notificações
        window.dispatchEvent(new CustomEvent('notificationsChanged', { detail: { enabled } }));
    }

    applyReminderTime() {
        const time = this.settings.reminderTime;

        // Atualizar agendamento de lembretes
        this.scheduleReminders(time);

        // Disparar evento de mudança de horário de lembrete
        window.dispatchEvent(new CustomEvent('reminderTimeChanged', { detail: { time } }));
    }

    async requestNotificationPermission() {
        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                this.settings.notifications = false;
                this.saveSettings();
                showNotification('Permissão de notificação negada', 'warning');
            }
        } catch (error) {
            console.error('Erro ao solicitar permissão de notificação:', error);
            showNotification('Erro ao solicitar permissão de notificação', 'error');
        }
    }

    cancelNotificationPermission() {
        // Cancelar notificações agendadas
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                registration.getNotifications().then(notifications => {
                    notifications.forEach(notification => notification.close());
                });
            });
        }
    }

    scheduleReminders(time) {
        if (!this.settings.notifications) return;

        // Cancelar lembretes anteriores
        this.cancelReminders();

        // Agendar novo lembrete
        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        const reminder = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            hours,
            minutes,
            0
        );

        // Se o horário já passou hoje, agendar para amanhã
        if (reminder < now) {
            reminder.setDate(reminder.getDate() + 1);
        }

        // Calcular tempo até o lembrete
        const timeUntilReminder = reminder.getTime() - now.getTime();

        // Agendar notificação
        setTimeout(() => {
            this.showReminder();
            // Agendar próximo lembrete para amanhã
            this.scheduleReminders(time);
        }, timeUntilReminder);
    }

    cancelReminders() {
        // Limpar timeouts de lembretes
        if (this.reminderTimeout) {
            clearTimeout(this.reminderTimeout);
        }
    }

    showReminder() {
        if (!this.settings.notifications) return;

        const notification = new Notification('Lembrete de Leitura Bíblica', {
            body: 'Não se esqueça de fazer sua leitura bíblica hoje!',
            icon: '/images/icon.png'
        });

        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }

    saveSettings() {
        userProgress.updateSettings(this.settings);
        showNotification('Configurações salvas com sucesso!', 'success');
    }

    resetSettings() {
        this.settings = {
            theme: 'system',
            fontSize: 'medium',
            notifications: true,
            reminderTime: '08:00'
        };

        this.applyTheme();
        this.applyFontSize();
        this.applyNotifications();
        this.applyReminderTime();
        this.saveSettings();
        showNotification('Configurações resetadas com sucesso!', 'success');
    }

    exportData() {
        userProgress.exportData();
    }

    async importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                await userProgress.importData(file);
            }
        };

        input.click();
    }

    clearData() {
        if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
            userProgress.clearData();
            this.resetSettings();
            showNotification('Dados limpos com sucesso!', 'success');
        }
    }
}

// Criar e exportar a instância do gerenciador de configurações
export const settings = new SettingsManager(); 