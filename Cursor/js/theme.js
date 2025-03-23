import { THEME_CONFIG } from './config.js';
import { settings } from './settings.js';
import { showNotification } from './common.js';
import { userProgress } from './user-progress.js';

class ThemeManager {
    constructor() {
        this.currentTheme = 'system';
        this.isInitialized = false;
    }

    initialize() {
        if (this.isInitialized) return;

        this.setupThemeSelector();
        this.setupEventListeners();
        this.loadTheme();
        this.isInitialized = true;
    }

    setupThemeSelector() {
        const themeSelector = document.querySelector('.theme-selector');
        if (!themeSelector) return;

        themeSelector.innerHTML = `
            <div class="theme-options">
                <button class="theme-option" data-theme="light">
                    <span class="material-icons">light_mode</span>
                    <span>Claro</span>
                </button>
                <button class="theme-option" data-theme="dark">
                    <span class="material-icons">dark_mode</span>
                    <span>Escuro</span>
                </button>
                <button class="theme-option" data-theme="system">
                    <span class="material-icons">settings_suggest</span>
                    <span>Sistema</span>
                </button>
            </div>
        `;
    }

    setupEventListeners() {
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.setTheme(theme);
            });
        });

        // Monitora mudanças na preferência do sistema
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (this.currentTheme === 'system') {
                    this.applyTheme();
                }
            });
        }

        // Listener para mudança de tema via configurações
        window.addEventListener('themeChanged', (e) => {
            this.currentTheme = e.detail.theme;
            this.applyTheme();
        });
    }

    loadTheme() {
        const savedTheme = userProgress.getSettings()?.theme;
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            this.currentTheme = settings.getTheme();
            this.applyTheme();
        }
    }

    setTheme(theme) {
        if (!['light', 'dark', 'system'].includes(theme)) return;

        this.currentTheme = theme;
        this.applyTheme();
        this.updateThemeUI();
        this.saveTheme();
    }

    applyTheme() {
        const root = document.documentElement;
        const themeConfig = THEME_CONFIG.themes[this.currentTheme] || THEME_CONFIG.themes.system;

        // Remove classes de tema anteriores
        root.classList.remove('theme-light', 'theme-dark');

        // Adiciona classe do novo tema
        if (this.currentTheme === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
        } else {
            root.classList.add(`theme-${this.currentTheme}`);
        }

        // Aplica variáveis CSS do tema
        Object.entries(themeConfig.colors).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value);
        });

        // Aplica variáveis de transição
        root.style.setProperty('--transition-duration', THEME_CONFIG.transition.duration);
        root.style.setProperty('--transition-easing', THEME_CONFIG.transition.easing);

        // Atualiza meta tag para cor do tema
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            document.head.appendChild(meta);
        }
        document.querySelector('meta[name="theme-color"]').content = themeConfig.colors.background;

        // Disparar evento de mudança de tema
        window.dispatchEvent(new CustomEvent('themeApplied', {
            detail: {
                theme: this.currentTheme,
                colors: themeConfig.colors
            }
        }));
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getThemeColors() {
        const themeConfig = THEME_CONFIG.themes[this.currentTheme] || THEME_CONFIG.themes.system;
        return { ...themeConfig.colors };
    }

    isDarkMode() {
        if (this.currentTheme === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return this.currentTheme === 'dark';
    }

    updateThemeUI() {
        const themeOptions = document.querySelectorAll('.theme-option');
        themeOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === this.currentTheme);
        });
    }

    saveTheme() {
        const settings = userProgress.getSettings() || {};
        settings.theme = this.currentTheme;
        userProgress.saveSettings(settings);
    }

    // Métodos de utilidade para cores
    getThemeColor(colorKey) {
        const theme = this.currentTheme === 'system' ? this.getSystemTheme() : this.currentTheme;
        return THEME_CONFIG.themes[theme]?.colors[colorKey] || THEME_CONFIG.themes.system.colors[colorKey];
    }

    getContrastRatio(color1, color2) {
        const l1 = this.getLuminance(color1);
        const l2 = this.getLuminance(color2);
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        return ratio.toFixed(2);
    }

    getLuminance(color) {
        const rgb = this.hexToRgb(color);
        const [r, g, b] = Object.values(rgb).map(val => {
            val = val / 255;
            return val <= 0.03928
                ? val / 12.92
                : Math.pow((val + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Métodos para transições
    addThemeTransition() {
        const root = document.documentElement;
        root.style.transition = `
            background-color ${THEME_CONFIG.transition.duration} ${THEME_CONFIG.transition.easing},
            color ${THEME_CONFIG.transition.duration} ${THEME_CONFIG.transition.easing},
            border-color ${THEME_CONFIG.transition.duration} ${THEME_CONFIG.transition.easing},
            box-shadow ${THEME_CONFIG.transition.duration} ${THEME_CONFIG.transition.easing}
        `;
    }

    removeThemeTransition() {
        const root = document.documentElement;
        root.style.transition = '';
    }

    // Métodos para gradientes
    getGradient(angle, colors) {
        return `linear-gradient(${angle}, ${colors.join(', ')})`;
    }

    // Métodos para sombras
    getShadow(level) {
        const shadows = {
            1: '0 2px 4px rgba(0, 0, 0, 0.1)',
            2: '0 4px 8px rgba(0, 0, 0, 0.1)',
            3: '0 8px 16px rgba(0, 0, 0, 0.1)',
            4: '0 16px 32px rgba(0, 0, 0, 0.1)'
        };
        return shadows[level] || shadows[1];
    }

    // Métodos para opacidade
    getOpacity(color, opacity) {
        const rgb = this.hexToRgb(color);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    }

    // Métodos para hover states
    getHoverColor(color, amount = 0.1) {
        const rgb = this.hexToRgb(color);
        const isDark = this.currentTheme === 'dark';
        const factor = isDark ? 1 + amount : 1 - amount;

        return `rgb(${Math.round(rgb.r * factor)}, ${Math.round(rgb.g * factor)}, ${Math.round(rgb.b * factor)})`;
    }

    // Métodos para estados ativos
    getActiveColor(color, amount = 0.2) {
        const rgb = this.hexToRgb(color);
        const isDark = this.currentTheme === 'dark';
        const factor = isDark ? 1 + amount : 1 - amount;

        return `rgb(${Math.round(rgb.r * factor)}, ${Math.round(rgb.g * factor)}, ${Math.round(rgb.b * factor)})`;
    }

    // Métodos para estados desabilitados
    getDisabledColor(color, amount = 0.5) {
        const rgb = this.hexToRgb(color);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${amount})`;
    }

    // Métodos para estados de foco
    getFocusColor(color, amount = 0.2) {
        const rgb = this.hexToRgb(color);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${amount})`;
    }

    // Métodos para estados de seleção
    getSelectionColor(color, amount = 0.2) {
        const rgb = this.hexToRgb(color);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${amount})`;
    }

    // Métodos para estados de erro
    getErrorColor(color, amount = 0.1) {
        const rgb = this.hexToRgb(color);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${amount})`;
    }

    // Métodos para estados de sucesso
    getSuccessColor(color, amount = 0.1) {
        const rgb = this.hexToRgb(color);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${amount})`;
    }

    // Métodos para estados de aviso
    getWarningColor(color, amount = 0.1) {
        const rgb = this.hexToRgb(color);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${amount})`;
    }

    // Métodos para estados de informação
    getInfoColor(color, amount = 0.1) {
        const rgb = this.hexToRgb(color);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${amount})`;
    }

    // Métodos para manipulação de elementos específicos
    applyThemeToElement(element, theme = this.currentTheme) {
        if (!element) return;

        const themeConfig = THEME_CONFIG.themes[theme] || THEME_CONFIG.themes.system;
        const colors = themeConfig.colors;

        // Aplicar cores de fundo
        if (element.dataset.background) {
            element.style.backgroundColor = colors[element.dataset.background];
        }

        // Aplicar cores de texto
        if (element.dataset.textColor) {
            element.style.color = colors[element.dataset.textColor];
        }

        // Aplicar cores de borda
        if (element.dataset.borderColor) {
            element.style.borderColor = colors[element.dataset.borderColor];
        }

        // Aplicar cores de sombra
        if (element.dataset.shadowColor) {
            element.style.boxShadow = `0 2px 4px ${colors[element.dataset.shadowColor]}`;
        }
    }

    // Métodos para animações de transição
    async transitionTheme(fromTheme, toTheme) {
        const root = document.documentElement;
        const fromConfig = THEME_CONFIG.themes[fromTheme] || THEME_CONFIG.themes.system;
        const toConfig = THEME_CONFIG.themes[toTheme] || THEME_CONFIG.themes.system;

        // Adicionar classe de transição
        root.classList.add('theme-transitioning');

        // Animar mudança de cores
        const duration = parseInt(THEME_CONFIG.transition.duration);
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Interpolar entre as cores
            Object.keys(toConfig.colors).forEach(key => {
                const fromColor = fromConfig.colors[key];
                const toColor = toConfig.colors[key];
                const interpolatedColor = this.interpolateColors(fromColor, toColor, progress);
                root.style.setProperty(`--${key}`, interpolatedColor);
            });

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Remover classe de transição
                root.classList.remove('theme-transitioning');
            }
        };

        requestAnimationFrame(animate);
    }

    interpolateColors(color1, color2, progress) {
        // Converter cores hex para RGB
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);

        // Interpolar cada componente
        const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * progress);
        const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * progress);
        const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * progress);

        // Converter de volta para hex
        return this.rgbToHex(r, g, b);
    }

    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    // Métodos para gerenciamento de temas personalizados
    createCustomTheme(name, colors) {
        if (THEME_CONFIG.themes[name]) {
            showNotification('Tema já existe', 'error');
            return false;
        }

        THEME_CONFIG.themes[name] = {
            name: name,
            colors: { ...colors }
        };

        showNotification('Tema personalizado criado com sucesso!', 'success');
        return true;
    }

    updateCustomTheme(name, colors) {
        if (!THEME_CONFIG.themes[name]) {
            showNotification('Tema não encontrado', 'error');
            return false;
        }

        THEME_CONFIG.themes[name].colors = { ...colors };
        showNotification('Tema personalizado atualizado com sucesso!', 'success');
        return true;
    }

    deleteCustomTheme(name) {
        if (!THEME_CONFIG.themes[name]) {
            showNotification('Tema não encontrado', 'error');
            return false;
        }

        delete THEME_CONFIG.themes[name];
        showNotification('Tema personalizado removido com sucesso!', 'success');
        return true;
    }

    getCustomThemes() {
        return Object.entries(THEME_CONFIG.themes)
            .filter(([key]) => !['light', 'dark', 'system'].includes(key))
            .map(([key, value]) => ({
                id: key,
                name: value.name,
                colors: value.colors
            }));
    }
}

// Exporta uma única instância
export const themeManager = new ThemeManager(); 