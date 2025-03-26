# Guia de Estilo

Este documento descreve as convenções de estilo e padrões de código para o projeto Biblia.

## JavaScript

### Estrutura Geral

- Use ES6+ features
- Use módulos ES6 para organização
- Use classes para encapsulamento
- Use async/await para operações assíncronas
- Evite variáveis globais

### Nomenclatura

```javascript
// Classes
class BibleReader {
    constructor() {
        // ...
    }
}

// Funções
function loadBibleVersion() {
    // ...
}

// Variáveis
const currentBook = 'Genesis';
let currentChapter = 1;

// Constantes
const MAX_CHAPTERS = 150;
const DEFAULT_VERSION = 'ACF';
```

### Organização de Código

```javascript
// Imports
import { Utils } from './common.js';
import { CONFIG } from './config.js';

// Classe
class BibleReader {
    // Propriedades
    constructor() {
        this.currentBook = null;
        this.currentChapter = null;
        this.currentVersion = null;
    }

    // Métodos públicos
    async init() {
        // ...
    }

    // Métodos privados
    #setupUI() {
        // ...
    }

    // Getters e Setters
    get currentReference() {
        return `${this.currentBook} ${this.currentChapter}`;
    }

    set currentReference(value) {
        [this.currentBook, this.currentChapter] = value.split(' ');
    }
}
```

### Tratamento de Erros

```javascript
try {
    await this.loadBibleVersion();
} catch (error) {
    console.error('Erro ao carregar versão:', error);
    Utils.showNotification('Erro ao carregar versão', 'error');
}
```

## CSS

### Estrutura

- Use variáveis CSS para valores comuns
- Organize por componentes
- Use BEM para nomenclatura
- Mantenha especificidade baixa
- Use media queries para responsividade

### Variáveis CSS

```css
:root {
    /* Cores */
    --primary-color: #1976d2;
    --secondary-color: #424242;
    --background-color: #ffffff;
    --text-color: #212121;
    --text-muted: #757575;
    --border-color: #e0e0e0;
    --error-color: #d32f2f;
    --success-color: #388e3c;
    --warning-color: #f57c00;
    --info-color: #0288d1;

    /* Tipografia */
    --font-family: 'Roboto', sans-serif;
    --font-size-base: 16px;
    --line-height-base: 1.5;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-bold: 700;

    /* Espaçamento */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;

    /* Bordas */
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 16px;

    /* Sombras */
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.1);
}
```

### BEM (Block Element Modifier)

```css
/* Bloco */
.bible-reader {
    /* ... */
}

/* Elemento */
.bible-reader__header {
    /* ... */
}

.bible-reader__content {
    /* ... */
}

/* Modificador */
.bible-reader--dark {
    /* ... */
}

.bible-reader__button--primary {
    /* ... */
}
```

### Media Queries

```css
/* Mobile First */
.bible-reader {
    padding: var(--spacing-md);
}

/* Tablet */
@media (min-width: 768px) {
    .bible-reader {
        padding: var(--spacing-lg);
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .bible-reader {
        padding: var(--spacing-xl);
    }
}
```

## HTML

### Estrutura

- Use HTML5 semântico
- Mantenha estrutura limpa e organizada
- Use atributos ARIA quando necessário
- Otimize para SEO
- Mantenha acessibilidade

### Exemplo de Estrutura

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Leia a Bíblia online">
    <title>Biblia - Leitura Bíblica</title>
    <link rel="stylesheet" href="css/common.css">
</head>
<body>
    <header class="app-header">
        <nav class="main-nav">
            <!-- ... -->
        </nav>
    </header>

    <main class="bible-reader">
        <section class="bible-reader__header">
            <!-- ... -->
        </section>

        <section class="bible-reader__content">
            <!-- ... -->
        </section>
    </main>

    <footer class="app-footer">
        <!-- ... -->
    </footer>

    <script type="module" src="js/bible-reader.js"></script>
</body>
</html>
```

### Atributos ARIA

```html
<button 
    class="bible-reader__button"
    aria-label="Próximo capítulo"
    aria-controls="bible-content"
>
    <span class="material-icons">arrow_forward</span>
</button>
```

## Documentação

### Comentários

```javascript
/**
 * Carrega uma versão específica da Bíblia
 * @param {string} version - ID da versão a ser carregada
 * @returns {Promise<void>}
 * @throws {Error} Se a versão não for encontrada
 */
async loadBibleVersion(version) {
    // ...
}
```

### README

- Inclua descrição clara do projeto
- Liste funcionalidades principais
- Forneça instruções de instalação
- Documente configurações
- Inclua exemplos de uso

## Versionamento

- Use [Semantic Versioning](https://semver.org/)
- Formato: MAJOR.MINOR.PATCH
- Exemplo: 1.2.3

## Git

### Commits

- Use mensagens claras e descritivas
- Siga o formato: `tipo: descrição`
- Exemplo: `feat: adiciona suporte a nova versão`

### Branches

- main: produção
- develop: desenvolvimento
- feature/*: novas funcionalidades
- fix/*: correções
- release/*: preparação para release

## Performance

- Otimize carregamento de recursos
- Use lazy loading
- Minimize requisições HTTP
- Comprima assets
- Use cache adequadamente

## Segurança

- Valide inputs
- Escape outputs
- Use HTTPS
- Implemente CSP
- Mantenha dependências atualizadas 