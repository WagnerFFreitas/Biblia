import { BIBLE_CONFIG } from './config.js';
import { showNotification } from './common.js';

class BibleVersions {
    constructor() {
        this.versions = BIBLE_CONFIG.versions;
        this.currentVersion = null;
        this.isInitialized = false;
    }

    initialize() {
        this.setupVersionsUI();
        this.setupEventListeners();
        this.loadLastVersion();
        this.isInitialized = true;
    }

    setupVersionsUI() {
        const versionsSection = document.querySelector('.bible-versions');
        if (!versionsSection) return;

        versionsSection.innerHTML = `
            <div class="versions-container">
                <div class="versions-header">
                    <h3>Versões</h3>
                    <button class="btn btn-icon" id="toggleVersions" title="Alternar painel de versões">
                        <span class="material-icons">expand_more</span>
                    </button>
                </div>

                <div class="versions-content">
                    <div class="version-selector">
                        <div class="version-search">
                            <input type="text" class="search-input" placeholder="Buscar versão...">
                            <span class="material-icons">search</span>
                        </div>
                        <div class="versions-list">
                            <!-- Versões serão carregadas dinamicamente -->
                        </div>
                    </div>

                    <div class="version-settings">
                        <div class="settings-header">
                            <h4>Configurações</h4>
                        </div>
                        <div class="settings-content">
                            <div class="setting-item">
                                <label>Tamanho da fonte</label>
                                <div class="font-size-controls">
                                    <button class="btn btn-icon" data-action="decrease" title="Diminuir tamanho">
                                        <span class="material-icons">remove</span>
                                    </button>
                                    <span class="font-size-value">100%</span>
                                    <button class="btn btn-icon" data-action="increase" title="Aumentar tamanho">
                                        <span class="material-icons">add</span>
                                    </button>
                                </div>
                            </div>
                            <div class="setting-item">
                                <label>Modo de leitura</label>
                                <div class="reading-mode-controls">
                                    <button class="btn btn-icon" data-mode="paragraph" title="Modo parágrafo">
                                        <span class="material-icons">format_paragraph</span>
                                    </button>
                                    <button class="btn btn-icon" data-mode="verse" title="Modo versículo">
                                        <span class="material-icons">format_list_numbered</span>
                                    </button>
                                </div>
                            </div>
                            <div class="setting-item">
                                <label>Tema</label>
                                <div class="theme-controls">
                                    <button class="btn btn-icon" data-theme="light" title="Tema claro">
                                        <span class="material-icons">light_mode</span>
                                    </button>
                                    <button class="btn btn-icon" data-theme="sepia" title="Tema sépia">
                                        <span class="material-icons">filter_vintage</span>
                                    </button>
                                    <button class="btn btn-icon" data-theme="dark" title="Tema escuro">
                                        <span class="material-icons">dark_mode</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Alternar painel de versões
        const toggleBtn = document.getElementById('toggleVersions');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleVersions());
        }

        // Busca de versões
        const searchInput = document.querySelector('.version-search .search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleVersionSearch(e.target.value));
        }

        // Controles de tamanho da fonte
        const fontSizeControls = document.querySelectorAll('.font-size-controls .btn');
        fontSizeControls.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.adjustFontSize(action);
            });
        });

        // Controles de modo de leitura
        const readingModeControls = document.querySelectorAll('.reading-mode-controls .btn');
        readingModeControls.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                this.setReadingMode(mode);
            });
        });

        // Controles de tema
        const themeControls = document.querySelectorAll('.theme-controls .btn');
        themeControls.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                this.setTheme(theme);
            });
        });
    }

    loadLastVersion() {
        const savedVersion = localStorage.getItem('lastBibleVersion');
        if (savedVersion && this.versions.find(v => v.id === savedVersion)) {
            this.setVersion(savedVersion);
        } else {
            this.setVersion(this.versions[0].id);
        }
    }

    setVersion(versionId) {
        const version = this.versions.find(v => v.id === versionId);
        if (!version) return;

        this.currentVersion = version;
        localStorage.setItem('lastBibleVersion', versionId);
        this.updateVersionsList();
        this.emitVersionChanged();
    }

    updateVersionsList() {
        const versionsList = document.querySelector('.versions-list');
        if (!versionsList) return;

        versionsList.innerHTML = this.versions.map(version => `
            <div class="version-item ${version.id === this.currentVersion.id ? 'active' : ''}" 
                 data-version="${version.id}">
                <div class="version-info">
                    <span class="version-name">${version.name}</span>
                    <span class="version-language">${version.language}</span>
                </div>
                <div class="version-actions">
                    <button class="btn btn-icon" title="Baixar para leitura offline">
                        <span class="material-icons">download</span>
                    </button>
                    <button class="btn btn-icon" title="Informações">
                        <span class="material-icons">info</span>
                    </button>
                </div>
            </div>
        `).join('');

        // Adicionar listeners de clique às versões
        this.setupVersionsListeners();
    }

    setupVersionsListeners() {
        const versions = document.querySelectorAll('.version-item');
        versions.forEach(version => {
            version.addEventListener('click', () => {
                this.setVersion(version.dataset.version);
            });
        });
    }

    handleVersionSearch(query) {
        const versionsList = document.querySelector('.versions-list');
        if (!versionsList) return;

        const filteredVersions = this.versions.filter(version => 
            version.name.toLowerCase().includes(query.toLowerCase()) ||
            version.language.toLowerCase().includes(query.toLowerCase())
        );

        versionsList.innerHTML = filteredVersions.map(version => `
            <div class="version-item ${version.id === this.currentVersion.id ? 'active' : ''}" 
                 data-version="${version.id}">
                <div class="version-info">
                    <span class="version-name">${version.name}</span>
                    <span class="version-language">${version.language}</span>
                </div>
                <div class="version-actions">
                    <button class="btn btn-icon" title="Baixar para leitura offline">
                        <span class="material-icons">download</span>
                    </button>
                    <button class="btn btn-icon" title="Informações">
                        <span class="material-icons">info</span>
                    </button>
                </div>
            </div>
        `).join('');

        // Adicionar listeners de clique às versões filtradas
        this.setupVersionsListeners();
    }

    toggleVersions() {
        const container = document.querySelector('.versions-container');
        if (!container) return;

        container.classList.toggle('collapsed');
    }

    adjustFontSize(action) {
        const fontSizeValue = document.querySelector('.font-size-value');
        if (!fontSizeValue) return;

        let currentSize = parseInt(fontSizeValue.textContent);
        if (action === 'increase') {
            currentSize = Math.min(currentSize + 10, 200);
        } else {
            currentSize = Math.max(currentSize - 10, 50);
        }

        fontSizeValue.textContent = `${currentSize}%`;
        this.applyFontSize(currentSize);
    }

    applyFontSize(size) {
        document.documentElement.style.setProperty('--bible-font-size', `${size}%`);
        localStorage.setItem('bibleFontSize', size);
    }

    setReadingMode(mode) {
        const buttons = document.querySelectorAll('.reading-mode-controls .btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        document.documentElement.setAttribute('data-reading-mode', mode);
        localStorage.setItem('readingMode', mode);
    }

    setTheme(theme) {
        const buttons = document.querySelectorAll('.theme-controls .btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });

        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    emitVersionChanged() {
        const event = new CustomEvent('versionChanged', {
            detail: {
                version: this.currentVersion
            }
        });
        document.dispatchEvent(event);
    }
}

// Exportar uma única instância
export const bibleVersions = new BibleVersions(); 