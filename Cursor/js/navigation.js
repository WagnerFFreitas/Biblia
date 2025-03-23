import { NAVIGATION_CONFIG } from './config.js';
import { showNotification } from './common.js';
import { userProgress } from './user-progress.js';
import { themeManager } from './theme.js';

class NavigationManager {
    constructor() {
        this.currentSection = NAVIGATION_CONFIG.navigation.defaultSection;
        this.navigationHistory = [];
        this.menuOpen = false;
        this.isInitialized = false;
        this.menuButton = document.querySelector('.menu-button');
        this.closeMenuButton = document.querySelector('.close-menu');
        this.sideMenu = document.querySelector('.side-menu');
        this.modals = {
            profile: document.getElementById('profileModal'),
            settings: document.getElementById('settingsModal')
        };
        this.closeModalButtons = document.querySelectorAll('.close-modal');
        this.menuLinks = document.querySelectorAll('.menu-items a');
    }

    initialize() {
        if (this.isInitialized) return;

        this.setupNavigation();
        this.setupEventListeners();
        this.handleInitialRoute();
        this.setupModalHandlers();
        this.setupNavigationHandlers();
        this.updateActiveSection();
        this.isInitialized = true;
    }

    setupNavigation() {
        const header = document.querySelector('header');
        if (!header) return;

        header.innerHTML = `
            <div class="header-content">
                <div class="header-left">
                    <button class="btn btn-icon" id="toggleSidebar">
                        <span class="material-icons">menu</span>
                    </button>
                    <h1>${NAVIGATION_CONFIG.APP_NAME}</h1>
                </div>

                <div class="header-right">
                    <button class="btn btn-icon" id="toggleTheme">
                        <span class="material-icons">palette</span>
                    </button>
                    <button class="btn btn-icon" id="toggleSearch">
                        <span class="material-icons">search</span>
                    </button>
                </div>
            </div>

            <nav class="main-nav">
                <ul>
                    <li>
                        <a href="#bible" class="nav-link">
                            <span class="material-icons">menu_book</span>
                            <span>Bíblia</span>
                        </a>
                    </li>
                    <li>
                        <a href="#hymns" class="nav-link">
                            <span class="material-icons">music_note</span>
                            <span>Hinos</span>
                        </a>
                    </li>
                    <li>
                        <a href="#resources" class="nav-link">
                            <span class="material-icons">folder</span>
                            <span>Recursos</span>
                        </a>
                    </li>
                    <li>
                        <a href="#study" class="nav-link">
                            <span class="material-icons">school</span>
                            <span>Estudo</span>
                        </a>
                    </li>
                    <li>
                        <a href="#settings" class="nav-link">
                            <span class="material-icons">settings</span>
                            <span>Configurações</span>
                        </a>
                    </li>
                </ul>
            </nav>
        `;
    }

    setupEventListeners() {
        // Listener para mudança de hash na URL
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });

        // Listener para botão de menu
        const menuButton = document.getElementById('toggleSidebar');
        if (menuButton) {
            menuButton.addEventListener('click', () => this.toggleSidebar());
        }

        // Toggle Theme
        const toggleThemeBtn = document.getElementById('toggleTheme');
        if (toggleThemeBtn) {
            toggleThemeBtn.addEventListener('click', () => this.toggleTheme());
        }

        // Toggle Search
        const toggleSearchBtn = document.getElementById('toggleSearch');
        if (toggleSearchBtn) {
            toggleSearchBtn.addEventListener('click', () => this.toggleSearch());
        }

        // Menu lateral
        this.menuButton.addEventListener('click', () => this.toggleMenu());
        this.closeMenuButton.addEventListener('click', () => this.toggleMenu());

        // Listener para fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (this.sideMenu.classList.contains('active') &&
                !this.sideMenu.contains(e.target) &&
                !this.menuButton.contains(e.target)) {
                this.toggleMenu();
            }
        });

        // Fechar modais ao clicar fora
        document.addEventListener('click', (e) => {
            Object.values(this.modals).forEach(modal => {
                if (modal.classList.contains('active') &&
                    !modal.querySelector('.modal-content').contains(e.target)) {
                    this.closeModal(modal);
                }
            });
        });

        // Fechar modais com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                Object.values(this.modals).forEach(modal => {
                    if (modal.classList.contains('active')) {
                        this.closeModal(modal);
                    }
                });
            }
        });

        // Links de navegação
        this.menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const target = link.getAttribute('href').substring(1);
                if (target !== 'settings') {
                    e.preventDefault();
                    this.navigateTo(target);
                }
            });
        });

        // Navegação com histórico
        window.addEventListener('popstate', () => {
            this.updateActiveSection();
        });
    }

    handleInitialRoute() {
        const hash = window.location.hash.substring(1);
        if (hash && NAVIGATION_CONFIG.sections[hash]) {
            this.navigateTo(hash);
        } else {
            this.navigateTo(NAVIGATION_CONFIG.navigation.defaultSection);
        }
    }

    handleRouteChange() {
        const hash = window.location.hash.substring(1);
        if (hash && NAVIGATION_CONFIG.sections[hash]) {
            this.navigateTo(hash);
        } else {
            this.navigateTo(NAVIGATION_CONFIG.navigation.defaultSection);
        }
    }

    navigateTo(section) {
        if (!NAVIGATION_CONFIG.sections[section]) {
            showNotification('Seção não encontrada', 'error');
            return;
        }

        // Atualizar URL
        if (NAVIGATION_CONFIG.navigation.updateHistory) {
            window.location.hash = section;
        } else {
            window.history.replaceState(null, null, `#${section}`);
        }

        // Atualizar seção atual
        this.currentSection = section;

        // Atualizar UI
        this.updateActiveSection();
        this.updatePageTitle();
        this.closeMenu();

        // Disparar evento de mudança de seção
        window.dispatchEvent(new CustomEvent('sectionChanged', { detail: { section } }));

        // Atualiza o progresso do usuário
        userProgress.updateLastSection(section);
    }

    updateActiveSection() {
        // Remover classe active de todas as seções
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Adicionar classe active à seção atual
        const currentSection = document.getElementById(`${this.currentSection}-section`);
        if (currentSection) {
            currentSection.classList.add('active');
        }

        // Atualizar links do menu
        this.menuLinks.forEach(link => {
            const section = link.getAttribute('href').substring(1);
            link.classList.toggle('active', section === this.currentSection);
        });
    }

    updatePageTitle() {
        const sectionConfig = NAVIGATION_CONFIG.sections[this.currentSection];
        document.title = `${sectionConfig.title} - Bíblia`;
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.toggle('active');
        }
    }

    toggleTheme() {
        const currentTheme = themeManager.currentTheme;
        const themes = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        themeManager.setTheme(themes[nextIndex]);
    }

    toggleSearch() {
        const searchBar = document.querySelector('.search-bar');
        if (searchBar) {
            searchBar.classList.toggle('active');
            if (searchBar.classList.contains('active')) {
                searchBar.querySelector('input').focus();
            }
        }
    }

    toggleMenu() {
        this.sideMenu.classList.toggle('active');
        document.body.style.overflow = this.sideMenu.classList.contains('active') ? 'hidden' : '';
    }

    openModal(modalId) {
        const modal = this.modals[modalId];
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.updateModalContent(modalId);
        }
    }

    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    updateModalContent(modalId) {
        switch (modalId) {
            case 'profile':
                this.updateProfileModal();
                break;
            case 'settings':
                this.updateSettingsModal();
                break;
        }
    }

    updateProfileModal() {
        const progress = userProgress.getProgress();
        const stats = userProgress.getReadingStats();
        const streak = userProgress.calculateReadingStreak();

        // Atualizar informações do usuário
        const levelElement = document.querySelector('.level');
        const streakElement = document.querySelector('.streak');
        const totalReadingsElement = document.querySelector('.total-readings');
        const totalStudiesElement = document.querySelector('.total-studies');
        const totalNotesElement = document.querySelector('.total-notes');

        if (levelElement) levelElement.textContent = Math.floor(stats.totalReadings / 100) + 1;
        if (streakElement) streakElement.textContent = streak;
        if (totalReadingsElement) totalReadingsElement.textContent = stats.totalReadings;
        if (totalStudiesElement) totalStudiesElement.textContent = stats.totalStudies;
        if (totalNotesElement) totalNotesElement.textContent = stats.totalNotes;
    }

    updateSettingsModal() {
        const settings = userProgress.getSettings();
        
        // Atualizar valores dos campos
        const themeSelect = document.getElementById('theme');
        const fontSizeSelect = document.getElementById('fontSize');
        const notificationsCheckbox = document.getElementById('notifications');
        const reminderTimeInput = document.getElementById('reminderTime');

        if (themeSelect) themeSelect.value = settings.theme;
        if (fontSizeSelect) fontSizeSelect.value = settings.fontSize;
        if (notificationsCheckbox) notificationsCheckbox.checked = settings.notifications;
        if (reminderTimeInput) reminderTimeInput.value = settings.reminderTime;

        // Configurar eventos dos campos
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                userProgress.updateSetting('theme', e.target.value);
                showNotification('Tema atualizado com sucesso!', 'success');
            });
        }

        if (fontSizeSelect) {
            fontSizeSelect.addEventListener('change', (e) => {
                userProgress.updateSetting('fontSize', e.target.value);
                showNotification('Tamanho da fonte atualizado com sucesso!', 'success');
            });
        }

        if (notificationsCheckbox) {
            notificationsCheckbox.addEventListener('change', (e) => {
                userProgress.updateSetting('notifications', e.target.checked);
                showNotification('Configurações de notificação atualizadas!', 'success');
            });
        }

        if (reminderTimeInput) {
            reminderTimeInput.addEventListener('change', (e) => {
                userProgress.updateSetting('reminderTime', e.target.value);
                showNotification('Horário do lembrete atualizado!', 'success');
            });
        }

        // Configurar botões de ação
        const exportButton = document.getElementById('exportData');
        const importButton = document.getElementById('importData');
        const clearButton = document.getElementById('clearData');

        if (exportButton) {
            exportButton.addEventListener('click', () => {
                userProgress.exportData()
                    .then(() => showNotification('Dados exportados com sucesso!', 'success'))
                    .catch(() => showNotification('Erro ao exportar dados.', 'error'));
            });
        }

        if (importButton) {
            importButton.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        userProgress.importData(file)
                            .then(() => showNotification('Dados importados com sucesso!', 'success'))
                            .catch(() => showNotification('Erro ao importar dados.', 'error'));
                    }
                };
                input.click();
            });
        }

        if (clearButton) {
            clearButton.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
                    userProgress.clearData()
                        .then(() => {
                            showNotification('Dados limpos com sucesso!', 'success');
                            this.closeModal(this.modals.settings);
                        })
                        .catch(() => showNotification('Erro ao limpar dados.', 'error'));
                }
            });
        }
    }

    // Métodos para navegação programática
    goToHome() {
        this.navigateTo('home');
    }

    goToBible() {
        this.navigateTo('bible');
    }

    goToHymns() {
        this.navigateTo('hymns');
    }

    goToStudy() {
        this.navigateTo('study');
    }

    goToResources() {
        this.navigateTo('resources');
    }

    goToSettings() {
        this.navigateTo('settings');
    }

    // Métodos para gerenciar breadcrumbs
    updateBreadcrumbs() {
        const breadcrumbs = document.getElementById('breadcrumbs');
        if (!breadcrumbs) return;

        const sectionConfig = NAVIGATION_CONFIG.sections[this.currentSection];
        breadcrumbs.innerHTML = `
            <a href="#home" class="breadcrumb-link">Início</a>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">${sectionConfig.title}</span>
        `;
    }

    // Métodos para navegação no histórico
    goBack() {
        if (this.navigationHistory.length > 0) {
            this.navigationHistory.pop();
            const previousSection = this.navigationHistory[this.navigationHistory.length - 1];
            if (previousSection) {
                this.navigateTo(previousSection);
            }
        }
    }

    goForward() {
        // Implementar navegação para frente
    }

    // Métodos para gerenciar scroll
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: NAVIGATION_CONFIG.navigation.scrollBehavior
        });
    }

    scrollToBottom() {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: NAVIGATION_CONFIG.navigation.scrollBehavior
        });
    }

    // Métodos para gerenciar modais
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // Métodos para gerenciar tabs
    switchTab(tabId) {
        const tabContainer = document.querySelector('.tab-container');
        if (!tabContainer) return;

        // Remover classe active de todas as tabs
        tabContainer.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Adicionar classe active à tab selecionada
        const selectedTab = tabContainer.querySelector(`[data-tab="${tabId}"]`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }

        // Atualizar conteúdo
        const contentContainer = document.querySelector('.tab-content');
        if (contentContainer) {
            contentContainer.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });

            const selectedPanel = contentContainer.querySelector(`[data-panel="${tabId}"]`);
            if (selectedPanel) {
                selectedPanel.classList.add('active');
            }
        }
    }
}

// Criar e exportar a instância do gerenciador de navegação
export const navigation = new NavigationManager(); 