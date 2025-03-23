// Configurações globais
const CONFIG = {
    CACHE_DURATION: 3600000, // 1 hora em milissegundos
    MAX_CACHE_SIZE: 100, // Número máximo de versículos em cache
    API_BASE_URL: '/api',
    BIBLE_VERSIONS: [], // Será preenchido em outro lugar do código
    HYMN_BOOKS: [], // Será preenchido em outro lugar do código
    ADDITIONAL_RESOURCES: [] // Será preenchido em outro lugar do código
};

// Cache de versículos
const versiculoCache = new Map();

// Função para limpar o cache
function clearCache() {
    versiculoCache.clear();
}

// Função para obter um versículo do cache ou carregar do servidor
async function getVersiculo(livro, capitulo, versiculo, versao) {
    const cacheKey = `${versao}-${livro}-${capitulo}-${versiculo}`;
    const cached = versiculoCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CONFIG.CACHE_DURATION) {
        return cached.data;
    }

    try {
        const response = await fetch(`${versao}/${livro}/${capitulo}.json`);
        const data = await response.json();
        
        // Limpar cache se estiver muito grande
        if (versiculoCache.size >= CONFIG.MAX_CACHE_SIZE) {
            clearCache();
        }

        versiculoCache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });

        return data;
    } catch (error) {
        console.error('Erro ao carregar versículo:', error);
        return null;
    }
}

// Função para criar botões de capítulos
function createCapitulosButtons(livro, versao) {
    const capitulos = livros[livro].capitulos;
    const capitulosContainer = document.createElement('div');
    capitulosContainer.classList.add('capitulos');

    for (let i = 1; i <= capitulos; i++) {
        const button = document.createElement('button');
        button.textContent = `${i}`;
        button.classList.add('botao-capitulo');
        button.addEventListener('click', () => {
            toggleVersiculos(livro, i, versao);
        });
        capitulosContainer.appendChild(button);
    }
    return capitulosContainer;
}

// Função para criar botões de versículos
function createVersiculosButtons(capitulo, versao) {
    const versiculosContainer = document.createElement('div');
    versiculosContainer.classList.add('versiculos');

    for (let i = 1; i <= capitulo.versiculos; i++) {
        const button = document.createElement('button');
        button.textContent = `${i}`;
        button.classList.add('botao-versiculo');
        button.addEventListener('click', () => {
            loadVersiculo(capitulo.livro, capitulo.numero, i, versao);
        });
        versiculosContainer.appendChild(button);
    }
    return versiculosContainer;
}

// Função para mostrar/esconder versículos
function toggleVersiculos(livro, capitulo, versao) {
    const content = document.querySelector('.content');
    const existingVersiculos = content.querySelector('.versiculos');
    
    if (existingVersiculos) {
        existingVersiculos.remove();
    }

    const versiculosContainer = createVersiculosButtons({
        livro,
        numero: capitulo,
        versiculos: livros[livro].capitulos
    }, versao);

    content.appendChild(versiculosContainer);
}

// Função para carregar um versículo específico
async function loadVersiculo(livro, capitulo, versiculo, versao) {
    const content = document.querySelector('.content');
    const existingVersiculo = content.querySelector('.versiculo-texto');
    
    if (existingVersiculo) {
        existingVersiculo.remove();
    }

    const versiculoData = await getVersiculo(livro, capitulo, versiculo, versao);
    
    if (!versiculoData) {
        content.innerHTML = '<div class="versiculo versiculo-texto">Versículo não encontrado.</div>';
        return;
    }

    const versiculoElement = document.createElement('div');
    versiculoElement.classList.add('versiculo', 'versiculo-texto');
    versiculoElement.innerHTML = versiculoData.conteudo;
    
    content.appendChild(versiculoElement);
}

// Função para inicializar a navegação
function initializeNavigation(versao) {
    const menuLivros = document.querySelector('.menu-livros');
    const livrosList = menuLivros.querySelector('ul');

    livrosList.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.dataset.livro) {
            e.preventDefault();
            const livro = link.dataset.livro;
            const capitulosContainer = createCapitulosButtons(livro, versao);
            
            const content = document.querySelector('.content');
            content.innerHTML = '';
            content.appendChild(capitulosContainer);
        }
    });
}

// Configurações globais
const config = {
    searchTypes: {
        bible: 'bible',
        hymn: 'hymn',
        dictionary: 'dictionary',
        concordance: 'concordance'
    }
};

// Gerenciador de eventos do DOM
document.addEventListener('DOMContentLoaded', () => {
    initializeSearchBar();
    initializeCards();
    initializeAddButton();
});

// Inicializa a barra de busca
function initializeSearchBar() {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');

    if (!searchInput || !searchButton) return;

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (!query) {
            showMessage('Por favor, digite algo para buscar', 'error');
            return;
        }
        handleSearch(query);
    });

    // Permite buscar ao pressionar Enter
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
}

// Inicializa o botão de adicionar
function initializeAddButton() {
    const addButton = document.querySelector('.add-button');
    if (!addButton) return;

    addButton.addEventListener('click', () => {
        showMessage('Funcionalidade em desenvolvimento', 'info');
    });
}

// Inicializa os cards
function initializeCards() {
    // Versões da Bíblia
    const bibleContainer = document.getElementById('bibleVersions');
    CONFIG.BIBLE_VERSIONS.forEach(version => {
        const card = createCard(version, 'bible');
        bibleContainer.appendChild(card);
    });

    // Hinários
    const hymnContainer = document.getElementById('hymnBooks');
    CONFIG.HYMN_BOOKS.forEach(book => {
        const card = createCard(book, 'hymn');
        hymnContainer.appendChild(card);
    });

    // Recursos
    const resourceContainer = document.getElementById('additionalResources');
    CONFIG.ADDITIONAL_RESOURCES.forEach(resource => {
        const card = createCard(resource, resource.id);
        resourceContainer.appendChild(card);
    });
}

// Função para criar um card
function createCard(item, type) {
    const card = document.createElement('a');
    card.href = '#';
    card.className = 'card';
    card.dataset.type = type;
    card.dataset.id = item.id;

    card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <h3>${item.name.toLowerCase()}</h3>
    `;

    // Adiciona evento de clique
    card.addEventListener('click', (e) => {
        e.preventDefault();
        handleCardClick(type, item);
    });

    return card;
}

// Manipula o clique nos cards
function handleCardClick(type, item) {
    switch (type) {
        case 'bible':
            // Abre a versão da Bíblia selecionada
            window.location.href = `bible.html?version=${item.id}`;
            break;
        case 'hymn':
            // Abre o hinário selecionado
            window.location.href = `hymn.html?book=${item.id}`;
            break;
        case 'dictionary':
            // Abre o dicionário
            window.location.href = 'dictionary.html';
            break;
        case 'concordance':
            // Abre a concordância
            window.location.href = 'concordance.html';
            break;
    }
}

// Manipula a busca
function handleSearch(query) {
    // Determina o tipo de conteúdo baseado no texto
    const type = determineSearchType(query);
    
    // Redireciona para a página apropriada com o termo de busca
    switch (type) {
        case config.searchTypes.bible:
            window.location.href = `search.html?type=bible&q=${encodeURIComponent(query)}`;
            break;
        case config.searchTypes.hymn:
            window.location.href = `search.html?type=hymn&q=${encodeURIComponent(query)}`;
            break;
        case config.searchTypes.dictionary:
            window.location.href = `dictionary.html?q=${encodeURIComponent(query)}`;
            break;
        case config.searchTypes.concordance:
            window.location.href = `concordance.html?q=${encodeURIComponent(query)}`;
            break;
    }
}

// Determina o tipo de busca baseado no texto
function determineSearchType(query) {
    // Implementar lógica para determinar o tipo de busca
    // Por enquanto, assume que é busca bíblica
    return config.searchTypes.bible;
}

// Exibe mensagens para o usuário
function showMessage(message, type = 'info') {
    // Por enquanto, usa alert. Pode ser melhorado para um toast/notification
    alert(message);
}

// Exporta as configurações e funções necessárias
window.config = config;

// Exportar funções e configurações
export {
    CONFIG,
    getVersiculo,
    createCapitulosButtons,
    createVersiculosButtons,
    toggleVersiculos,
    loadVersiculo,
    initializeNavigation
};

// Utilitários comuns
export class Utils {
    // Formatar data
    static formatDate(date, format = 'pt-BR') {
        return new Date(date).toLocaleDateString(format, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Formatar número
    static formatNumber(number, locale = 'pt-BR') {
        return new Intl.NumberFormat(locale).format(number);
    }

    // Formatar texto
    static formatText(text, options = {}) {
        const {
            capitalize = false,
            uppercase = false,
            lowercase = false,
            trim = true
        } = options;

        let formatted = text;

        if (trim) {
            formatted = formatted.trim();
        }

        if (capitalize) {
            formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
        }

        if (uppercase) {
            formatted = formatted.toUpperCase();
        }

        if (lowercase) {
            formatted = formatted.toLowerCase();
        }

        return formatted;
    }

    // Validar email
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Validar senha
    static validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return password.length >= minLength &&
               hasUpperCase &&
               hasLowerCase &&
               hasNumbers &&
               hasSpecialChar;
    }

    // Validar URL
    static validateUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // Debounce
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle
    static throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Clonar objeto profundamente
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // Mesclar objetos
    static mergeObjects(...objects) {
        return objects.reduce((acc, obj) => {
            Object.keys(obj).forEach(key => {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    acc[key] = this.mergeObjects(acc[key] || {}, obj[key]);
                } else {
                    acc[key] = obj[key];
                }
            });
            return acc;
        }, {});
    }

    // Obter número aleatório
    static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Embaralhar array
    static shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Agrupar array por chave
    static groupBy(array, key) {
        return array.reduce((result, item) => {
            const group = item[key];
            result[group] = result[group] || [];
            result[group].push(item);
            return result;
        }, {});
    }

    // Ordenar array por chave
    static sortBy(array, key, order = 'asc') {
        return [...array].sort((a, b) => {
            const aValue = a[key];
            const bValue = b[key];

            if (order === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }

    // Filtrar array por termo de busca
    static filterBySearch(array, searchTerm, keys) {
        const term = searchTerm.toLowerCase();
        return array.filter(item => {
            return keys.some(key => {
                const value = item[key];
                return value && value.toString().toLowerCase().includes(term);
            });
        });
    }

    // Paginar array
    static paginate(array, page = 1, perPage = 10) {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        return {
            data: array.slice(start, end),
            total: array.length,
            page,
            perPage,
            totalPages: Math.ceil(array.length / perPage)
        };
    }

    // Gerar ID único
    static generateId(prefix = '') {
        return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Verificar se valor está vazio
    static isEmpty(value) {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim().length === 0;
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === 'object') return Object.keys(value).length === 0;
        return false;
    }

    // Verificar se valor é número
    static isNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    // Verificar se valor é inteiro
    static isInteger(value) {
        return Number.isInteger(Number(value));
    }

    // Verificar se valor é decimal
    static isFloat(value) {
        return this.isNumber(value) && !this.isInteger(value);
    }

    // Verificar se valor é booleano
    static isBoolean(value) {
        return typeof value === 'boolean';
    }

    // Verificar se valor é string
    static isString(value) {
        return typeof value === 'string';
    }

    // Verificar se valor é array
    static isArray(value) {
        return Array.isArray(value);
    }

    // Verificar se valor é objeto
    static isObject(value) {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }

    // Verificar se valor é função
    static isFunction(value) {
        return typeof value === 'function';
    }

    // Verificar se valor é data
    static isDate(value) {
        return value instanceof Date && !isNaN(value);
    }

    // Verificar se valor é email
    static isEmail(value) {
        return this.validateEmail(value);
    }

    // Verificar se valor é URL
    static isUrl(value) {
        return this.validateUrl(value);
    }

    // Verificar se valor é telefone
    static isPhone(value) {
        const re = /^\+?[\d\s-()]{10,}$/;
        return re.test(value);
    }

    // Verificar se valor é CPF
    static isCPF(value) {
        const re = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;
        return re.test(value);
    }

    // Verificar se valor é CNPJ
    static isCNPJ(value) {
        const re = /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/;
        return re.test(value);
    }

    // Verificar se valor é CEP
    static isZipCode(value) {
        const re = /^\d{5}-?\d{3}$/;
        return re.test(value);
    }

    // Verificar se valor é cartão de crédito
    static isCreditCard(value) {
        const re = /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/;
        return re.test(value);
    }

    // Verificar se valor é senha
    static isPassword(value) {
        return this.validatePassword(value);
    }

    // Verificar se valor é string vazia
    static isEmptyString(value) {
        return typeof value === 'string' && value.trim().length === 0;
    }

    // Verificar se valor é espaço em branco
    static isWhitespace(value) {
        return typeof value === 'string' && /^\s*$/.test(value);
    }

    // Verificar se valor é string numérica
    static isNumericString(value) {
        return typeof value === 'string' && /^\d+$/.test(value);
    }

    // Verificar se valor é string alfabética
    static isAlphaString(value) {
        return typeof value === 'string' && /^[a-zA-Z]+$/.test(value);
    }

    // Verificar se valor é string alfanumérica
    static isAlphanumericString(value) {
        return typeof value === 'string' && /^[a-zA-Z0-9]+$/.test(value);
    }

    // Verificar se valor é palíndromo
    static isPalindrome(value) {
        const str = value.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
        return str === str.split('').reverse().join('');
    }

    // Verificar se valor é número primo
    static isPrimeNumber(value) {
        if (!this.isInteger(value) || value < 2) return false;
        for (let i = 2; i <= Math.sqrt(value); i++) {
            if (value % i === 0) return false;
        }
        return true;
    }

    // Verificar se valor é número par
    static isEvenNumber(value) {
        return this.isInteger(value) && value % 2 === 0;
    }

    // Verificar se valor é número ímpar
    static isOddNumber(value) {
        return this.isInteger(value) && value % 2 !== 0;
    }

    // Verificar se valor é número positivo
    static isPositiveNumber(value) {
        return this.isNumber(value) && value > 0;
    }

    // Verificar se valor é número negativo
    static isNegativeNumber(value) {
        return this.isNumber(value) && value < 0;
    }

    // Verificar se valor é zero
    static isZero(value) {
        return this.isNumber(value) && value === 0;
    }

    // Verificar se valor é número inteiro positivo
    static isPositiveInteger(value) {
        return this.isInteger(value) && value > 0;
    }

    // Verificar se valor é número inteiro negativo
    static isNegativeInteger(value) {
        return this.isInteger(value) && value < 0;
    }

    // Verificar se valor é número natural
    static isNaturalNumber(value) {
        return this.isInteger(value) && value >= 0;
    }

    // Verificar se valor é número inteiro não negativo
    static isWholeNumber(value) {
        return this.isInteger(value) && value >= 0;
    }

    // Verificar se valor é número racional
    static isRationalNumber(value) {
        return this.isNumber(value) && !isNaN(value);
    }

    // Verificar se valor é número irracional
    static isIrrationalNumber(value) {
        return this.isNumber(value) && isNaN(value);
    }

    // Verificar se valor é número finito
    static isFiniteNumber(value) {
        return Number.isFinite(Number(value));
    }

    // Verificar se valor é número infinito
    static isInfiniteNumber(value) {
        return !Number.isFinite(Number(value));
    }

    // Verificar se valor é NaN
    static isNaN(value) {
        return Number.isNaN(Number(value));
    }

    // Verificar se valor é nulo
    static isNull(value) {
        return value === null;
    }

    // Verificar se valor é indefinido
    static isUndefined(value) {
        return value === undefined;
    }

    // Verificar se valor é nulo ou indefinido
    static isNullOrUndefined(value) {
        return value === null || value === undefined;
    }

    // Verificar se valor é verdadeiro
    static isTruthy(value) {
        return Boolean(value);
    }

    // Verificar se valor é falso
    static isFalsy(value) {
        return !Boolean(value);
    }

    // Verificar se valor é objeto vazio
    static isEmptyObject(value) {
        return this.isObject(value) && Object.keys(value).length === 0;
    }

    // Verificar se valor é array vazio
    static isEmptyArray(value) {
        return this.isArray(value) && value.length === 0;
    }

    // Verificar se valor é string vazia ou espaço em branco
    static isEmptyStringOrWhitespace(value) {
        return this.isEmptyString(value) || this.isWhitespace(value);
    }

    // Verificar se valor é array ou objeto vazio
    static isEmptyArrayOrObject(value) {
        return this.isEmptyArray(value) || this.isEmptyObject(value);
    }

    // Verificar se valor está vazio ou é nulo ou indefinido
    static isEmptyOrNullOrUndefined(value) {
        return this.isEmpty(value) || this.isNullOrUndefined(value);
    }

    // Verificar se valor é string de data válida
    static isValidDateString(value) {
        const date = new Date(value);
        return this.isDate(date);
    }

    // Verificar se valor é string de hora válida
    static isValidTimeString(value) {
        const re = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return re.test(value);
    }

    // Verificar se valor é string de data e hora válida
    static isValidDateTimeString(value) {
        const date = new Date(value);
        return this.isDate(date) && !isNaN(date.getTime());
    }

    // Verificar se valor é string de cor válida
    static isValidColorString(value) {
        const re = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        return re.test(value);
    }

    // Verificar se valor é string hexadecimal válida
    static isValidHexString(value) {
        const re = /^[0-9A-Fa-f]+$/;
        return re.test(value);
    }

    // Verificar se valor é string base64 válida
    static isValidBase64String(value) {
        const re = /^[A-Za-z0-9+/]*={0,2}$/;
        return re.test(value);
    }

    // Verificar se valor é string JSON válida
    static isValidJsonString(value) {
        try {
            JSON.parse(value);
            return true;
        } catch {
            return false;
        }
    }

    // Verificar se valor é string XML válida
    static isValidXmlString(value) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(value, 'text/xml');
        return !doc.getElementsByTagName('parsererror').length;
    }

    // Verificar se valor é string HTML válida
    static isValidHtmlString(value) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(value, 'text/html');
        return !doc.getElementsByTagName('parsererror').length;
    }

    // Verificar se valor é string CSS válida
    static isValidCssString(value) {
        const style = document.createElement('style');
        style.textContent = value;
        return style.sheet !== null;
    }

    // Verificar se valor é string JavaScript válida
    static isValidJavaScriptString(value) {
        try {
            new Function(value);
            return true;
        } catch {
            return false;
        }
    }

    // Verificar se valor é string de expressão regular válida
    static isValidRegExpString(value) {
        try {
            new RegExp(value);
            return true;
        } catch {
            return false;
        }
    }

    // Verificar se valor é string de URL válida
    static isValidUrlString(value) {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    }

    // Verificar se valor é string de email válida
    static isValidEmailString(value) {
        return this.isEmail(value);
    }

    // Verificar se valor é string de telefone válida
    static isValidPhoneString(value) {
        return this.isPhone(value);
    }

    // Verificar se valor é string de CPF válida
    static isValidCPFString(value) {
        return this.isCPF(value);
    }

    // Verificar se valor é string de CNPJ válida
    static isValidCNPJString(value) {
        return this.isCNPJ(value);
    }

    // Verificar se valor é string de CEP válida
    static isValidZipCodeString(value) {
        return this.isZipCode(value);
    }

    // Verificar se valor é string de cartão de crédito válida
    static isValidCreditCardString(value) {
        return this.isCreditCard(value);
    }

    // Verificar se valor é string de senha válida
    static isValidPasswordString(value) {
        return this.isPassword(value);
    }

    // Verificar se valor é string de nome válida
    static isValidNameString(value) {
        return typeof value === 'string' && /^[a-zA-ZÀ-ÿ\s]{2,}$/.test(value);
    }

    // Verificar se valor é string de nome de usuário válida
    static isValidUsernameString(value) {
        return typeof value === 'string' && /^[a-zA-Z0-9_]{3,}$/.test(value);
    }

    // Verificar se valor é string de slug válida
    static isValidSlugString(value) {
        return typeof value === 'string' && /^[a-z0-9-]+$/.test(value);
    }

    // Verificar se valor é string de UUID válida
    static isValidUUIDString(value) {
        const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return re.test(value);
    }

    // Verificar se valor é string de ISBN válida
    static isValidISBNString(value) {
        const re = /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3}[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4}[- 0-9]{17}$)|(?=97[89][0-9]{10}$))[- 0-9X]{17}$/;
        return re.test(value);
    }

    // Verificar se valor é string de ISSN válida
    static isValidISSNString(value) {
        const re = /^[0-9]{4}-[0-9]{3}[0-9X]$/;
        return re.test(value);
    }

    // Verificar se valor é string de EAN válida
    static isValidEANString(value) {
        const re = /^[0-9]{13}$/;
        return re.test(value);
    }

    // Verificar se valor é string de UPC válida
    static isValidUPCString(value) {
        const re = /^[0-9]{12}$/;
        return re.test(value);
    }

    // Verificar se valor é string de GTIN válida
    static isValidGTINString(value) {
        const re = /^[0-9]{8,14}$/;
        return re.test(value);
    }

    // Verificar se valor é string de ASIN válida
    static isValidASINString(value) {
        const re = /^[A-Z0-9]{10}$/;
        return re.test(value);
    }

    // Verificar se valor é string de DOI válida
    static isValidDOIString(value) {
        const re = /^10.\d{4,9}/[-._;()/:\w]+$/;
        return re.test(value);
    }

    // Verificar se valor é string de ORCID válida
    static isValidORCIDString(value) {
        const re = /^0000-000(1-[5]|2-[0-9]|3-[0-4])\d{3}-\d{3}[\dX]$/;
        return re.test(value);
    }

    static async downloadContent(type, id) {
        try {
            showNotification('Iniciando download...', 'info');
            
            // Verificar espaço disponível
            if (!this.checkStorageSpace()) {
                showNotification('Espaço insuficiente para download', 'error');
                return;
            }

            // Buscar conteúdo da API
            const response = await fetch(`/api/download/${type}/${id}`);
            if (!response.ok) {
                throw new Error('Erro ao baixar conteúdo');
            }

            const data = await response.json();
            
            // Salvar no cache local
            await this.saveToCache(type, id, data);
            
            // Criar arquivo para download
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}-${id}.json`;
            a.click();
            window.URL.revokeObjectURL(url);

            showNotification('Download concluído com sucesso', 'success');
        } catch (error) {
            console.error('Erro no download:', error);
            showNotification('Erro ao baixar conteúdo', 'error');
        }
    }

    static async saveToCache(type, id, data) {
        try {
            const cacheKey = `cache_${type}_${id}`;
            const cacheData = {
                timestamp: Date.now(),
                data: data
            };
            
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
            
            // Atualizar lista de itens em cache
            const cacheList = JSON.parse(localStorage.getItem('cache_list') || '[]');
            if (!cacheList.includes(cacheKey)) {
                cacheList.push(cacheKey);
                localStorage.setItem('cache_list', JSON.stringify(cacheList));
            }
        } catch (error) {
            console.error('Erro ao salvar no cache:', error);
            throw error;
        }
    }

    static checkStorageSpace() {
        try {
            const testKey = 'storage_test';
            localStorage.setItem(testKey, 'a');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    static async clearCache() {
        try {
            const cacheList = JSON.parse(localStorage.getItem('cache_list') || '[]');
            for (const key of cacheList) {
                localStorage.removeItem(key);
            }
            localStorage.removeItem('cache_list');
            showNotification('Cache limpo com sucesso', 'success');
        } catch (error) {
            console.error('Erro ao limpar cache:', error);
            showNotification('Erro ao limpar cache', 'error');
        }
    }

    static getCacheSize() {
        try {
            let totalSize = 0;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                totalSize += value.length * 2; // UTF-16 uses 2 bytes per character
            }
            return totalSize;
        } catch (error) {
            console.error('Erro ao calcular tamanho do cache:', error);
            return 0;
        }
    }

    static formatCacheSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }
}

// Notificações
export function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">
            <span class="material-icons">
                ${getNotificationIcon(type)}
            </span>
        </span>
        <span class="notification-message">${message}</span>
        <button class="notification-close">
            <span class="material-icons">close</span>
        </button>
    `;

    document.body.appendChild(notification);

    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
    }

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Ícones de notificação
function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return 'check_circle';
        case 'error':
            return 'error';
        case 'warning':
            return 'warning';
        case 'info':
        default:
            return 'info';
    }
}

// Exportar utilitários
export const utils = new Utils(); 