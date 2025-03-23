// Configuração das categorias dos livros da Bíblia
export const categoriasLivros = {
    lei: {
        titulo: "Lei (Pentateuco)",
        livros: [
            { id: "genesis", nome: "Gênesis" },
            { id: "exodo", nome: "Êxodo" },
            { id: "levitico", nome: "Levítico" },
            { id: "numeros", nome: "Números" },
            { id: "deuteronomio", nome: "Deuteronômio" }
        ]
    },
    historicos: {
        titulo: "Históricos",
        livros: [
            { id: "josue", nome: "Josué" },
            { id: "juizes", nome: "Juízes" },
            { id: "rute", nome: "Rute" },
            { id: "1samuel", nome: "1º Samuel" },
            { id: "2samuel", nome: "2º Samuel" },
            { id: "1reis", nome: "1º Reis" },
            { id: "2reis", nome: "2º Reis" },
            { id: "1cronicas", nome: "1º Crônicas" },
            { id: "2cronicas", nome: "2º Crônicas" },
            { id: "esdras", nome: "Esdras" },
            { id: "neemias", nome: "Neemias" },
            { id: "ester", nome: "Ester" }
        ]
    },
    poeticos: {
        titulo: "Poéticos",
        livros: [
            { id: "jo", nome: "Jó" },
            { id: "salmos", nome: "Salmos" },
            { id: "proverbios", nome: "Provérbios" },
            { id: "eclesiastes", nome: "Eclesiastes" },
            { id: "cantares", nome: "Cantares" }
        ]
    },
    profetasMaiores: {
        titulo: "Profetas Maiores",
        livros: [
            { id: "isaias", nome: "Isaías" },
            { id: "jeremias", nome: "Jeremias" },
            { id: "lamentacoes", nome: "Lamentações" },
            { id: "ezequiel", nome: "Ezequiel" },
            { id: "daniel", nome: "Daniel" }
        ]
    },
    profetasMenores: {
        titulo: "Profetas Menores",
        livros: [
            { id: "oseias", nome: "Oseias" },
            { id: "joel", nome: "Joel" },
            { id: "amos", nome: "Amós" },
            { id: "obadias", nome: "Obadias" },
            { id: "jonas", nome: "Jonas" },
            { id: "miqueias", nome: "Miqueias" },
            { id: "naum", nome: "Naum" },
            { id: "habacuque", nome: "Habacuque" },
            { id: "sofonias", nome: "Sofonias" },
            { id: "ageu", nome: "Ageu" },
            { id: "zacarias", nome: "Zacarias" },
            { id: "malaquias", nome: "Malaquias" }
        ]
    },
    evangelhos: {
        titulo: "Evangelhos",
        livros: [
            { id: "mateus", nome: "Mateus" },
            { id: "marcos", nome: "Marcos" },
            { id: "lucas", nome: "Lucas" },
            { id: "joao", nome: "João" }
        ]
    },
    historico: {
        titulo: "Histórico",
        livros: [
            { id: "atos", nome: "Atos" }
        ]
    },
    cartas: {
        titulo: "Cartas",
        livros: [
            { id: "romanos", nome: "Romanos" },
            { id: "1corintios", nome: "1º Coríntios" },
            { id: "2corintios", nome: "2º Coríntios" },
            { id: "galatas", nome: "Gálatas" },
            { id: "efesios", nome: "Efésios" },
            { id: "filipenses", nome: "Filipenses" },
            { id: "colossenses", nome: "Colossenses" },
            { id: "1tessaloniceses", nome: "1º Tessalonicenses" },
            { id: "2tessaloniceses", nome: "2º Tessalonicenses" },
            { id: "1timoteo", nome: "1º Timóteo" },
            { id: "2timoteo", nome: "2º Timóteo" },
            { id: "tito", nome: "Tito" },
            { id: "filemom", nome: "Filemom" },
            { id: "hebreus", nome: "Hebreus" },
            { id: "tiago", nome: "Tiago" },
            { id: "1pedro", nome: "1º Pedro" },
            { id: "2pedro", nome: "2º Pedro" },
            { id: "1joao", nome: "1º João" },
            { id: "2joao", nome: "2º João" },
            { id: "3joao", nome: "3º João" },
            { id: "judas", nome: "Judas" }
        ]
    },
    apocalipse: {
        titulo: "Apocalipse",
        livros: [
            { id: "apocalipse", nome: "Apocalipse" }
        ]
    }
};

// Configuração das versões disponíveis
export const versoes = [
    { id: "arc", nome: "Almeida Revista e Corrigida" },
    { id: "ara", nome: "Almeida Revista e Atualizada" },
    { id: "acf", nome: "Almeida Corrigida Fiel" },
    { id: "aa", nome: "Almeida Atualizada" },
    { id: "ra", nome: "Almeida Revisada" },
    { id: "nvi", nome: "Nova Versão Internacional" }
];

// Configuração do cache
export const cacheConfig = {
    maxSize: 100,
    duration: 3600000 // 1 hora em milissegundos
};

// Configurações do projeto
const CONFIG = {
    // Tipos de busca
    SEARCH_TYPES: {
        BIBLE: 'bible',
        HYMN: 'hymn',
        DICTIONARY: 'dictionary',
        CONCORDANCE: 'concordance'
    },

    // Versões da Bíblia
    BIBLE_VERSIONS: [
        {
            id: 'acf',
            name: 'Almeida Corrigida Fiel',
            description: 'Tradução fiel ao texto original',
            image: 'img/bible-acf.jpg'
        },
        {
            id: 'ara',
            name: 'Almeida Revista e Atualizada',
            description: 'Tradução em português moderno',
            image: 'img/bible-ara.jpg'
        },
        {
            id: 'nvi',
            name: 'Nova Versão Internacional',
            description: 'Tradução em português contemporâneo',
            image: 'img/bible-nvi.jpg'
        }
    ],

    // Livros de hinos
    HYMN_BOOKS: [
        {
            id: 'cantor',
            name: 'Cantor Cristão',
            description: 'Hinos tradicionais da igreja',
            image: 'img/cantor-cristao.jpg'
        },
        {
            id: 'harpa',
            name: 'Harpa Cristã',
            description: 'Hinos pentecostais',
            image: 'img/harpa-crista.jpg'
        }
    ],

    // Recursos adicionais
    ADDITIONAL_RESOURCES: [
        {
            id: 'dictionary',
            name: 'Dicionário Bíblico',
            description: 'Definições e explicações de termos bíblicos',
            image: 'img/dictionary.jpg'
        },
        {
            id: 'concordance',
            name: 'Concordância Bíblica',
            description: 'Referências e citações da Bíblia',
            image: 'img/concordance.jpg'
        }
    ],

    // URLs das páginas
    PAGES: {
        BIBLE: 'bible.html',
        HYMNS: 'hymns.html',
        DICTIONARY: 'dictionary.html',
        CONCORDANCE: 'concordance.html'
    },

    // Configurações de API
    API: {
        BASE_URL: 'https://api.biblia.com/v1',
        ENDPOINTS: {
            BIBLE: '/bible',
            HYMNS: '/hymns',
            DICTIONARY: '/dictionary',
            CONCORDANCE: '/concordance'
        }
    },

    // Configurações de UI
    UI: {
        CARD_WIDTH: 233,
        CARD_HEIGHT: 350,
        SPACING_UNIT: 8,
        FONT_FAMILY: 'Roboto, sans-serif',
        FONT_SIZE_BASE: 16,
        LINE_HEIGHT_BASE: 1.5
    },

    // Cursos e Links Temáticos
    courses: {
        enabled: true,
        categories: [
            {
                id: 'fundamentos',
                name: 'Fundamentos da Fé',
                description: 'Cursos básicos sobre doutrinas fundamentais',
                courses: [
                    {
                        id: 'crencas-basicas',
                        name: 'Crenças Básicas do Cristianismo',
                        description: 'Estudo das principais doutrinas cristãs',
                        duration: '8 semanas',
                        level: 'Iniciante',
                        topics: [
                            'Deus e a Trindade',
                            'Jesus Cristo',
                            'Espírito Santo',
                            'Salvação',
                            'Igreja',
                            'Escatologia'
                        ]
                    },
                    {
                        id: 'hermeneutica',
                        name: 'Hermenêutica Bíblica',
                        description: 'Métodos de interpretação da Bíblia',
                        duration: '10 semanas',
                        level: 'Intermediário',
                        topics: [
                            'Princípios de interpretação',
                            'Gêneros literários',
                            'Contexto histórico',
                            'Linguagem figurada',
                            'Profecia',
                            'Aplicação prática'
                        ]
                    }
                ]
            },
            {
                id: 'vida-crista',
                name: 'Vida Cristã',
                description: 'Cursos práticos para o dia a dia',
                courses: [
                    {
                        id: 'oracao',
                        name: 'Vida de Oração',
                        description: 'Desenvolvendo uma vida de comunhão com Deus',
                        duration: '6 semanas',
                        level: 'Iniciante',
                        topics: [
                            'O que é oração',
                            'Tipos de oração',
                            'Modelos bíblicos',
                            'Obstáculos à oração',
                            'Oração eficaz',
                            'Prática diária'
                        ]
                    }
                ]
            }
        ]
    },

    thematicLinks: {
        enabled: true,
        categories: [
            {
                id: 'estudos-biblicos',
                name: 'Estudos Bíblicos',
                links: [
                    {
                        id: 'esboco-sermao',
                        name: 'Esboço de Sermão',
                        description: 'Modelos e exemplos de esboços',
                        url: '/recursos/esboco-sermao'
                    },
                    {
                        id: 'estudos-tematicos',
                        name: 'Estudos Temáticos',
                        description: 'Séries de estudos por temas',
                        url: '/recursos/estudos-tematicos'
                    }
                ]
            },
            {
                id: 'ministerio',
                name: 'Ministério',
                links: [
                    {
                        id: 'evangelismo',
                        name: 'Evangelismo',
                        description: 'Recursos para evangelização',
                        url: '/recursos/evangelismo'
                    },
                    {
                        id: 'discipulado',
                        name: 'Discipulado',
                        description: 'Materiais para discipulado',
                        url: '/recursos/discipulado'
                    }
                ]
            }
        ]
    },

    // Configurações gerais da aplicação
    api: {
        baseUrl: '/api',
        endpoints: {
            concordance: '/concordance',
            versions: '/versions',
            search: '/search'
        },
        timeout: 30000 // 30 segundos
    },

    // Configurações de cache
    cache: {
        enabled: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        storageKey: 'biblia_cache'
    },

    // Configurações de paginação
    pagination: {
        itemsPerPage: 20,
        maxPages: 10
    },

    // Configurações de busca
    search: {
        minLength: 2,
        debounceTime: 300, // milissegundos
        maxResults: 1000
    },

    // Configurações de idiomas
    languages: {
        pt: {
            name: 'Português',
            code: 'pt'
        },
        he: {
            name: 'Hebraico',
            code: 'he'
        },
        el: {
            name: 'Grego',
            code: 'el'
        }
    },

    // Configurações de temas
    themes: {
        light: {
            primary: '#1976d2',
            surface: '#ffffff',
            background: '#f5f5f5',
            text: '#212121',
            textMuted: '#757575',
            border: '#e0e0e0',
            error: '#d32f2f',
            success: '#388e3c',
            warning: '#f57c00',
            info: '#0288d1'
        },
        dark: {
            primary: '#90caf9',
            surface: '#121212',
            background: '#000000',
            text: '#ffffff',
            textMuted: '#b0b0b0',
            border: '#333333',
            error: '#f44336',
            success: '#4caf50',
            warning: '#ff9800',
            info: '#03a9f4'
        }
    },

    // Configurações de notificações
    notifications: {
        duration: 3000,
        position: 'top-right'
    },

    // Configurações de segurança
    security: {
        maxRequestsPerMinute: 60,
        allowedOrigins: ['*'],
        contentSecurityPolicy: {
            'default-src': ["'self'"],
            'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            'font-src': ["'self'", 'https://fonts.gstatic.com'],
            'img-src': ["'self'", 'data:', 'https:'],
            'connect-src': ["'self'", 'https://api.example.com']
        }
    },

    // Configurações de performance
    performance: {
        lazyLoading: true,
        imageOptimization: true,
        preloadCriticalAssets: true
    },

    // Configurações de acessibilidade
    accessibility: {
        highContrast: false,
        fontSize: 16,
        lineHeight: 1.5,
        reducedMotion: false
    }
};

// Exporta as configurações
window.CONFIG = CONFIG;

// Configurações da aplicação
export const APP_CONFIG = {
    name: 'Bíblia Online',
    version: '1.0.0',
    description: 'Leia e estude a Bíblia online com múltiplas versões e recursos',
    author: 'Seu Nome',
    license: 'MIT',
    repository: 'https://github.com/seu-usuario/biblia-online',
    support: 'https://github.com/seu-usuario/biblia-online/issues'
};

// Configurações da interface
export const UI_CONFIG = {
    themes: {
        light: {
            primary: '#2196F3',
            secondary: '#FFC107',
            background: '#FFFFFF',
            text: '#333333',
            border: '#E0E0E0'
        },
        sepia: {
            primary: '#795548',
            secondary: '#FFA726',
            background: '#F5E6D3',
            text: '#2C1810',
            border: '#D7B39C'
        },
        dark: {
            primary: '#64B5F6',
            secondary: '#FFD54F',
            background: '#121212',
            text: '#FFFFFF',
            border: '#333333'
        }
    },
    fontSizes: {
        small: '14px',
        medium: '16px',
        large: '18px'
    },
    breakpoints: {
        mobile: '320px',
        tablet: '768px',
        desktop: '1024px'
    }
};

// Configurações da Bíblia
export const BIBLE_CONFIG = {
    versions: [
        {
            id: 'acf',
            name: 'João Ferreira de Almeida Corrigida e Fiel',
            language: 'Português',
            year: '1994',
            publisher: 'Sociedade Bíblica Trinitariana',
            copyright: '© 1994 Sociedade Bíblica Trinitariana',
            description: 'Versão clássica e conservadora da Bíblia em português',
            available: true,
            offline: true
        },
        {
            id: 'ara',
            name: 'Almeida Revista e Atualizada',
            language: 'Português',
            year: '1993',
            publisher: 'Sociedade Bíblica do Brasil',
            copyright: '© 1993 Sociedade Bíblica do Brasil',
            description: 'Versão moderna e atualizada da Bíblia em português',
            available: true,
            offline: true
        },
        {
            id: 'nvi',
            name: 'Nova Versão Internacional',
            language: 'Português',
            year: '2000',
            publisher: 'Editora Vida',
            copyright: '© 2000 Editora Vida',
            description: 'Versão contemporânea e de fácil leitura',
            available: true,
            offline: true
        }
    ],
    books: [
        {
            id: 'genesis',
            name: 'Gênesis',
            testament: 'old',
            chapters: 50,
            description: 'O livro do princípio e da criação',
            author: 'Moisés',
            date: '1445-1405 a.C.'
        },
        {
            id: 'exodus',
            name: 'Êxodo',
            testament: 'old',
            chapters: 40,
            description: 'A libertação do povo de Israel do Egito',
            author: 'Moisés',
            date: '1445-1405 a.C.'
        },
        // Adicionar mais livros aqui
    ],
    studyResources: {
        concordance: {
            enabled: true,
            offline: true,
            sources: ['Strong', 'Young', 'Cruden']
        },
        dictionary: {
            enabled: true,
            offline: true,
            sources: ['Vine', 'Easton', 'Smith']
        },
        maps: {
            enabled: true,
            offline: true,
            sources: ['Bíblicas', 'Históricas', 'Arqueológicas']
        },
        timeline: {
            enabled: true,
            offline: true,
            sources: ['Bíblica', 'Histórica', 'Arqueológica']
        }
    },
    features: {
        search: {
            enabled: true,
            advanced: true,
            offline: true,
            options: {
                caseSensitive: false,
                wholeWords: false,
                includeNotes: true
            }
        },
        bookmarks: {
            enabled: true,
            sync: true,
            categories: ['Favoritos', 'Estudo', 'Pregação']
        },
        notes: {
            enabled: true,
            sync: true,
            categories: ['Pessoal', 'Estudo', 'Pregação']
        },
        sharing: {
            enabled: true,
            platforms: ['WhatsApp', 'Facebook', 'Twitter', 'Email']
        },
        offline: {
            enabled: true,
            storage: 'localStorage',
            maxSize: '100MB'
        }
    },
    api: {
        baseUrl: 'https://api.biblia-online.com',
        version: 'v1',
        endpoints: {
            bible: '/bible',
            search: '/search',
            study: '/study',
            user: '/user'
        },
        rateLimit: {
            requests: 100,
            period: 'minute'
        }
    },
    storage: {
        type: 'localStorage',
        keys: {
            settings: 'bible_settings',
            bookmarks: 'bible_bookmarks',
            notes: 'bible_notes',
            history: 'bible_history',
            offline: 'bible_offline'
        }
    },
    notifications: {
        enabled: true,
        types: ['info', 'success', 'warning', 'error'],
        duration: 3000,
        position: 'top-right'
    }
};

// Configurações de estudo
export const STUDY_CONFIG = {
    plans: {
        enabled: true,
        categories: [
            {
                id: 'devotional',
                name: 'Devocional',
                description: 'Planos para leitura e meditação diária',
                duration: '30 dias'
            },
            {
                id: 'thematic',
                name: 'Temático',
                description: 'Estudos sobre temas específicos',
                duration: '7-14 dias'
            },
            {
                id: 'chronological',
                name: 'Cronológico',
                description: 'Leitura da Bíblia em ordem cronológica',
                duration: '365 dias'
            }
        ]
    },
    resources: {
        enabled: true,
        types: [
            {
                id: 'commentaries',
                name: 'Comentários',
                description: 'Explicações e interpretações dos textos',
                sources: ['Matthew Henry', 'John Wesley', 'John Calvin']
            },
            {
                id: 'dictionaries',
                name: 'Dicionários',
                description: 'Definições e explicações de termos',
                sources: ['Vine', 'Easton', 'Smith']
            },
            {
                id: 'maps',
                name: 'Mapas',
                description: 'Mapas bíblicos e históricos',
                sources: ['Bíblicos', 'Históricos', 'Arqueológicos']
            }
        ]
    },
    tools: {
        enabled: true,
        types: [
            {
                id: 'timeline',
                name: 'Linha do Tempo',
                description: 'Visualização cronológica dos eventos',
                features: ['Bíblica', 'Histórica', 'Arqueológica']
            },
            {
                id: 'cross-references',
                name: 'Referências Cruzadas',
                description: 'Ligações entre passagens relacionadas',
                features: ['Diretas', 'Indiretas', 'Temáticas']
            },
            {
                id: 'word-study',
                name: 'Estudo de Palavras',
                description: 'Análise detalhada de termos específicos',
                features: ['Strong', 'Young', 'Cruden']
            }
        ]
    }
};

// Configurações de usuário
export const USER_CONFIG = {
    preferences: {
        defaultVersion: 'acf',
        defaultTheme: 'light',
        fontSize: 'medium',
        showVerseNumbers: true,
        showCrossReferences: true,
        showNotes: true,
        readingMode: 'paragraph',
        language: 'pt-BR'
    },
    features: {
        bookmarks: true,
        notes: true,
        history: true,
        offline: true,
        sync: true
    },
    notifications: {
        enabled: true,
        types: ['daily', 'weekly', 'monthly'],
        time: '08:00'
    }
};

// Configurações de cache
export const CACHE_CONFIG = {
    enabled: true,
    strategy: 'network-first',
    maxAge: '7d',
    maxSize: '100MB',
    patterns: [
        {
            url: '/api/bible/*',
            maxAge: '30d'
        },
        {
            url: '/api/study/*',
            maxAge: '7d'
        },
        {
            url: '/api/search/*',
            maxAge: '1d'
        }
    ]
};

// Configurações de segurança
export const SECURITY_CONFIG = {
    enabled: true,
    features: {
        ssl: true,
        cors: true,
        rateLimit: true,
        sanitization: true
    },
    headers: {
        'Content-Security-Policy': "default-src 'self'",
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff'
    }
};

// Configurações de analytics
export const ANALYTICS_CONFIG = {
    enabled: true,
    provider: 'google-analytics',
    trackingId: 'UA-XXXXXXXX-X',
    events: {
        pageView: true,
        search: true,
        bookmark: true,
        note: true,
        share: true
    }
};

// Exporta as configurações
export default CONFIG; 