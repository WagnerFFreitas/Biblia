/**
 * biblia-navegacao.js
 * Módulo principal de navegação da Bíblia
 * 
 * Este módulo é responsável por:
 * - Gerenciar a navegação entre livros, capítulos e versículos
 * - Controlar a exibição do conteúdo bíblico
 * - Manter o estado da navegação atual
 * - Interagir com o modo de leitura
 */

console.log("[biblia-navegacao.js] Script carregado.");

/**
 * Estrutura principal de todos os livros da Bíblia
 * Cada livro contém:
 * - capitulos: número total de capítulos
 * - displayName: nome formatado para exibição
 */
const livros = {
    "genesis": { "capitulos": 50, "displayName": "GÊNESIS" },
    "exodo": { "capitulos": 40, "displayName": "ÊXODO" },
    "levitico": { "capitulos": 27, "displayName": "LEVÍTICO" },
    "numeros": { "capitulos": 36, "displayName": "NÚMEROS" },
    "deuteronomio": { "capitulos": 34, "displayName": "DEUTERONÔMIO" },
    "josue": { "capitulos": 24, "displayName": "JOSUÉ" },
    "juizes": { "capitulos": 21, "displayName": "JUÍZES" },
    "rute": { "capitulos": 4, "displayName": "RUTE" },
    "1samuel": { "capitulos": 31, "displayName": "1º SAMUEL" },
    "2samuel": { "capitulos": 24, "displayName": "2º SAMUEL" },
    "1reis": { "capitulos": 22, "displayName": "1º REIS" },
    "2reis": { "capitulos": 25, "displayName": "2º REIS" },
    "1cronicas": { "capitulos": 29, "displayName": "1º CRÔNICAS" },
    "2cronicas": { "capitulos": 36, "displayName": "2º CRÔNICAS" },
    "esdras": { "capitulos": 10, "displayName": "ESDRAS" },
    "neemias": { "capitulos": 13, "displayName": "NEEMIAS" },
    "ester": { "capitulos": 10, "displayName": "ESTER" },
    "jo": { "capitulos": 42, "displayName": "JÓ" },
    "salmos": { "capitulos": 150, "displayName": "SALMOS" },
    "proverbios": { "capitulos": 31, "displayName": "PROVÉRBIOS" },
    "eclesiastes": { "capitulos": 12, "displayName": "ECLESIASTES" },
    "cantares": { "capitulos": 8, "displayName": "CANTARES" },
    "isaias": { "capitulos": 66, "displayName": "ISAÍAS" },
    "jeremias": { "capitulos": 52, "displayName": "JEREMIAS" },
    "lamentacoes": { "capitulos": 5, "displayName": "LAMENTAÇÕES" },
    "ezequiel": { "capitulos": 48, "displayName": "EZEQUIEL" },
    "daniel": { "capitulos": 12, "displayName": "DANIEL" },
    "oseias": { "capitulos": 14, "displayName": "OSÉIAS" },
    "joel": { "capitulos": 3, "displayName": "JOEL" },
    "amos": { "capitulos": 9, "displayName": "AMÓS" },
    "obadias": { "capitulos": 1, "displayName": "OBADIAS" },
    "jonas": { "capitulos": 4, "displayName": "JONAS" },
    "miqueias": { "capitulos": 7, "displayName": "MIQUÉIAS" },
    "naum": { "capitulos": 3, "displayName": "NAUM" },
    "habacuque": { "capitulos": 3, "displayName": "HABACUQUE" },
    "sofonias": { "capitulos": 3, "displayName": "SOFONIAS" },
    "ageu": { "capitulos": 2, "displayName": "AGEU" },
    "zacarias": { "capitulos": 14, "displayName": "ZACARIAS" },
    "malaquias": { "capitulos": 4, "displayName": "MALAQUIAS" },
    "mateus": { "capitulos": 28, "displayName": "MATEUS" },
    "marcos": { "capitulos": 16, "displayName": "MARCOS" },
    "lucas": { "capitulos": 24, "displayName": "LUCAS" },
    "joao": { "capitulos": 21, "displayName": "JOÃO" },
    "atos": { "capitulos": 28, "displayName": "ATOS" },
    "romanos": { "capitulos": 16, "displayName": "ROMANOS" },
    "1corintios": { "capitulos": 16, "displayName": "1ª CORÍNTIOS" },
    "2corintios": { "capitulos": 13, "displayName": "2ª CORÍNTIOS" },
    "galatas": { "capitulos": 6, "displayName": "GÁLATAS" },
    "efesios": { "capitulos": 6, "displayName": "EFÉSIOS" },
    "filipenses": { "capitulos": 4, "displayName": "FILIPENSES" },
    "colossenses": { "capitulos": 4, "displayName": "COLOSSENSES" },
    "1tessalonicenses": { "capitulos": 5, "displayName": "1ª TESSALONICENSES" },
    "2tessalonicenses": { "capitulos": 3, "displayName": "2ª TESSALONICENSES" },
    "1timoteo": { "capitulos": 6, "displayName": "1ª TIMÓTEO" },
    "2timoteo": { "capitulos": 4, "displayName": "2ª TIMÓTEO" },
    "tito": { "capitulos": 3, "displayName": "TITO" },
    "filemom": { "capitulos": 1, "displayName": "FILEMOM" },
    "hebreus": { "capitulos": 13, "displayName": "HEBREUS" },
    "tiago": { "capitulos": 5, "displayName": "TIAGO" },
    "1pedro": { "capitulos": 5, "displayName": "1ª PEDRO" },
    "2pedro": { "capitulos": 3, "displayName": "2ª PEDRO" },
    "1joao": { "capitulos": 5, "displayName": "1ª JOÃO" },
    "2joao": { "capitulos": 1, "displayName": "2ª JOÃO" },
    "3joao": { "capitulos": 1, "displayName": "3ª JOÃO" },
    "judas": { "capitulos": 1, "displayName": "JUDAS" },
    "apocalipse": { "capitulos": 22, "displayName": "APOCALIPSE" }
};

/**
 * Variáveis globais para controle de estado
 */
window.titulo = null;          // Elemento H2 que mostra o título atual
window.activeLivro = null;     // Livro atualmente selecionado
window.activeCapitulo = null;  // Capítulo atualmente selecionado
window.activeVersiculoButton = null; // Botão de versículo atualmente ativo

/**
 * Retorna o nome formatado de um livro para exibição
 * @param {string} livroKey - Chave do livro (ex: "genesis", "exodo")
 * @returns {string} Nome formatado do livro
 */
window.getLivroDisplayName = function(livroKey) {
    if (livros[livroKey] && livros[livroKey].displayName) {
        return livros[livroKey].displayName;
    }
    return livroKey ? livroKey.toUpperCase() : "LIVRO DESCONHECIDO";
};

/**
 * Cria botões para navegar entre capítulos de um livro
 * @param {string} livro - Nome do livro
 * @returns {HTMLElement} Container com botões dos capítulos
 */
function createCapitulosButtons(livro) {
    if (!livros[livro]) {
        console.error(`[Navegação createCapitulosButtons] Livro inválido: ${livro}`);
        const div = document.createElement('div');
        div.classList.add('capitulos', 'book-content');
        return div;
    }
    const capitulos = livros[livro].capitulos;
    const capitulosContainer = document.createElement('div');
    capitulosContainer.classList.add('capitulos', 'book-content');

    for (let i = 1; i <= capitulos; i++) {
        const button = document.createElement('button');
        button.textContent = `${i}`;
        button.classList.add('botao-capitulo');
        button.dataset.livro = livro;
        button.dataset.capitulo = i;

        button.addEventListener('click', (e) => {
            const livroClicado = e.currentTarget.dataset.livro;
            const capituloClicado = parseInt(e.currentTarget.dataset.capitulo);
            
            if (window.isReadingModeEnabled && typeof window.loadChapterInReadingMode === 'function') {
                window.activeLivro = livroClicado;
                window.activeCapitulo = capituloClicado;
                window.activeVersiculoButton = null;
                window.loadChapterInReadingMode(livroClicado, capituloClicado);
            } else {
                window.toggleVersiculos(livroClicado, capituloClicado);
            }
        });
        capitulosContainer.appendChild(button);
    }
    return capitulosContainer;
}

/**
 * Cria botões para navegar entre versículos de um capítulo
 * @param {string} livro - Nome do livro
 * @param {number} capitulo - Número do capítulo
 * @returns {HTMLElement} Container com botões dos versículos
 */
function createVersiculosButtons(livro, capitulo) {
    const versiculosContainer = document.createElement('div');
    versiculosContainer.classList.add('versiculos', 'book-content');

    if (typeof window.getSpecificVerseCount !== 'function') {
        console.error("[Navegação createVersiculosButtons] Erro: Função 'getSpecificVerseCount' não definida.");
        return versiculosContainer;
    }

    const numVersiculos = window.getSpecificVerseCount(livro, capitulo);

    if (numVersiculos === 0) {
        console.warn(`[Navegação createVersiculosButtons] 0 versículos para ${livro} ${capitulo}.`);
        const p = document.createElement('p');
        p.textContent = "Nenhum versículo encontrado para este capítulo.";
        p.style.textAlign = "center";
        versiculosContainer.appendChild(p);
        return versiculosContainer;
    }

    for (let i = 1; i <= numVersiculos; i++) {
        const button = document.createElement('button');
        button.textContent = `${i}`;
        button.classList.add('botao-versiculo');
        button.dataset.versiculo = i;
        button.addEventListener('click', () => {
            toggleVersiculoText(livro, capitulo, i, button);
        });
        versiculosContainer.appendChild(button);
    }
    return versiculosContainer;
}

/**
 * Alterna a exibição dos versículos de um capítulo
 * @param {string} livro - Nome do livro
 * @param {number} capitulo - Número do capítulo
 */
function toggleVersiculos(livro, capitulo) {
    const content = document.querySelector('.content');
    if (!content) { console.error("[Navegação toggleVersiculos] Elemento .content não encontrado."); return; }

    if (!window.titulo) window.titulo = content.querySelector('h2');

    const capitulosContainerDiv = content.querySelector('.capitulos-container.book-content');
    let allChapterButtons = [];
    if (capitulosContainerDiv) {
        const capitulosButtonsInnerDiv = capitulosContainerDiv.querySelector('.capitulos.book-content');
        if (capitulosButtonsInnerDiv) {
             allChapterButtons = Array.from(capitulosButtonsInnerDiv.querySelectorAll('button.botao-capitulo'));
        }
    }
    if (allChapterButtons.length === 0) {
        // Isso pode acontecer se `updateChapterButtons` de `versoes.js` tiver sido chamado
        // e criou um `.capitulos` solto, que não está dentro de `.capitulos-container`.
        const looseCapitulosDiv = content.querySelector('div.capitulos:not(.book-content)'); // Tenta pegar um solto
        if (looseCapitulosDiv) {
            allChapterButtons = Array.from(looseCapitulosDiv.querySelectorAll('button')); // Supondo que os botões não tenham .botao-capitulo
            if (allChapterButtons.length > 0) {
                console.warn("[Navegação toggleVersiculos] Usando botões de um '.capitulos' solto.");
            }
        }
        if(allChapterButtons.length === 0) {
            console.warn("[Navegação toggleVersiculos] Nenhum botão de capítulo encontrado para gerenciar estado ativo.");
        }
    }
    
    const existingVersiculosContent = content.querySelector('.versiculos-content');
    const existingTextoVersiculo = content.querySelector('.versiculo-texto');

    allChapterButtons.forEach(btn => btn.classList.remove('active'));

    const isCollapsing = window.activeLivro === livro && window.activeCapitulo === capitulo && existingVersiculosContent;

    if (isCollapsing) {
        console.log(`[Navegação toggleVersiculos] Recolhendo: ${livro} ${capitulo}`);
        if (existingVersiculosContent) existingVersiculosContent.remove();
        if (existingTextoVersiculo) existingTextoVersiculo.remove();

        if (window.titulo) window.titulo.textContent = window.getLivroDisplayName(livro);
        window.activeCapitulo = null;
        window.activeVersiculoButton = null;
        return;
    }

    console.log(`[Navegação toggleVersiculos] Exibindo: ${livro} ${capitulo}`);
    const currentChapterButton = allChapterButtons.find(btn => btn.dataset.livro === livro && parseInt(btn.dataset.capitulo) === capitulo);
    if (currentChapterButton) {
        currentChapterButton.classList.add('active');
    } else {
        // Tenta encontrar pelo número do capítulo se dataset não estiver presente (botões de versoes.js)
        const fallbackButton = allChapterButtons.find(btn => parseInt(btn.textContent) === capitulo && parseInt(btn.dataset.capitulo) === capitulo);
        if(fallbackButton) fallbackButton.classList.add('active');
        else console.warn(`[Navegação toggleVersiculos] Botão para ${livro} ${capitulo} não encontrado para marcar.`);
    }

    if (window.titulo) window.titulo.textContent = `${window.getLivroDisplayName(livro)} - CAPÍTULO ${capitulo}`;

    if (existingVersiculosContent) existingVersiculosContent.remove();
    if (existingTextoVersiculo) existingTextoVersiculo.remove();

    const versiculosContent = document.createElement('div');
    versiculosContent.classList.add('versiculos-content', 'book-content');
    versiculosContent.appendChild(createVersiculosButtons(livro, capitulo));

    if (capitulosContainerDiv) {
        capitulosContainerDiv.parentNode.insertBefore(versiculosContent, capitulosContainerDiv.nextSibling);
    } else {
        const refElement = content.querySelector('div.capitulos') || window.titulo; // Tenta inserir após .capitulos solto ou H2
        if (refElement && refElement.parentNode === content) {
            content.insertBefore(versiculosContent, refElement.nextSibling);
        } else {
            content.appendChild(versiculosContent);
        }
        console.warn("[Navegação toggleVersiculos] .capitulos-container não encontrado. Usando fallback para inserir versículos.");
    }

    window.activeLivro = livro;
    window.activeCapitulo = capitulo;
    window.activeVersiculoButton = null;
}

/**
 * Alterna a exibição do texto de um versículo específico
 */
function toggleVersiculoText(livro, capitulo, versiculo, button) {
    console.log(`[Navegação toggleVersiculoText] Para: ${livro} ${capitulo}:${versiculo}`);
    const content = document.querySelector('.content');
    if (!content) { console.error("[Navegação toggleVersiculoText] .content não encontrado."); return; }

    if (typeof window.loadSpecificVerse !== 'function') {
         console.error("[Navegação toggleVersiculoText] Erro: 'loadSpecificVerse' não definida.");
         return;
    }
    if (!window.titulo) window.titulo = content.querySelector('h2');

    if (window.activeVersiculoButton === button) {
        const existingVersiculoTextDiv = content.querySelector('.versiculo-texto');
        if (existingVersiculoTextDiv) existingVersiculoTextDiv.remove();
        if (window.titulo) window.titulo.textContent = `${window.getLivroDisplayName(livro)} - CAPÍTULO ${capitulo}`;
        if(window.activeVersiculoButton) window.activeVersiculoButton.classList.remove('active');
        window.activeVersiculoButton = null;
    } else {
        if (window.activeVersiculoButton) window.activeVersiculoButton.classList.remove('active');
        window.loadSpecificVerse(livro, capitulo, versiculo); 
        window.activeVersiculoButton = button;
        button.classList.add('active');
    }
}

/**
 * Carrega um livro da Bíblia e prepara sua interface
 */
function loadBook(livro) {
    console.log(`[Navegação loadBook] Tentando carregar: ${livro}, activeLivro atual: ${window.activeLivro}`);
    const content = document.querySelector('.content');
    if (!content) { console.error("[Navegação loadBook] Elemento .content não encontrado."); return; }

    const livroKey = Object.keys(livros).find(key => key.toLowerCase() === livro.toLowerCase());
    if (!livroKey) {
        console.error(`[Navegação loadBook] Chave de livro inválida: ${livro}`);
        return;
    }

    if (!window.titulo) { 
        window.titulo = content.querySelector('h2');
        if (!window.titulo) { 
            console.warn("[Navegação loadBook] H2 não encontrado, criando um novo.");
            window.titulo = document.createElement('h2');
            content.insertBefore(window.titulo, content.firstChild); // Inserção simples
        }
    }

    const selectorString = '.capitulos-container, div.capitulos, .versiculos-content, .versiculo-texto, .reading-mode-content';

    if (window.activeLivro === livroKey) {
        console.log(`[Navegação loadBook] Recolhendo livro: ${livroKey}`);
        console.log("[Navegação loadBook] DOM ANTES de recolher (mesmo livro):", content.innerHTML.length > 500 ? content.innerHTML.substring(0, 500) + "..." : content.innerHTML);
        const elementsToClear = content.querySelectorAll(selectorString);
        console.log("[Navegação loadBook] Elementos para recolher (mesmo livro):", elementsToClear);
        elementsToClear.forEach(el => el.remove());
        console.log("[Navegação loadBook] DOM APÓS recolher (mesmo livro):", content.innerHTML.length > 500 ? content.innerHTML.substring(0, 500) + "..." : content.innerHTML);
        
        if (window.titulo) window.titulo.textContent = '';
        window.activeLivro = null;
        window.activeCapitulo = null;
        window.activeVersiculoButton = null;

        if (window.isReadingModeEnabled && typeof window.toggleReadingMode === 'function') {
             window.toggleReadingMode(false, null, null);
        }
        return;
    }

    console.log(`[Navegação loadBook] Carregando NOVO livro ${livroKey}.`);
    console.log("[Navegação loadBook] DOM ANTES da limpeza (novo livro):", content.innerHTML.length > 500 ? content.innerHTML.substring(0, 500) + "..." : content.innerHTML);
    const elementsToRemove = content.querySelectorAll(selectorString);
    console.log("[Navegação loadBook] Elementos para remover (novo livro):", elementsToRemove);
    elementsToRemove.forEach(element => element.remove());
    console.log(`[Navegação loadBook] DOM APÓS limpeza para ${livroKey}:`, content.innerHTML.length > 500 ? content.innerHTML.substring(0, 500) + "..." : content.innerHTML);
    
    if (window.titulo) {
        window.titulo.textContent = window.getLivroDisplayName(livroKey);
    }

    const capitulosContainer = document.createElement('div');
    capitulosContainer.classList.add('capitulos-container', 'book-content');
    capitulosContainer.appendChild(createCapitulosButtons(livroKey));

    if (window.titulo && window.titulo.parentNode === content) {
        content.insertBefore(capitulosContainer, window.titulo.nextSibling);
    } else {
        content.appendChild(capitulosContainer);
        console.warn("[Navegação loadBook] Fallback: window.titulo não encontrado ou não é filho de .content.");
    }

    window.activeLivro = livroKey;
    window.activeCapitulo = null;
    window.activeVersiculoButton = null;

    if (window.isReadingModeEnabled && typeof window.toggleReadingMode === 'function') {
        console.log("[Navegação loadBook] Desativando modo leitura ao carregar novo livro.");
        window.toggleReadingMode(false, null, null);
        document.body.classList.remove('module-leitura');
        const modoLeituraBtn = document.getElementById('modo-leitura');
        if (modoLeituraBtn) {
            modoLeituraBtn.classList.remove('active');
            modoLeituraBtn.setAttribute('aria-pressed', 'false');
        }
    }
}

// === Inicialização ===
document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('.content');
    if (content) {
        window.titulo = content.querySelector('h2');
        if (!window.titulo) {
            console.warn("[Navegação DOMContentLoaded] H2 não encontrado. Criando.");
            window.titulo = document.createElement('h2');
            const firstRealContentChild = Array.from(content.childNodes).find(
                node => node.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE'].includes(node.tagName.toUpperCase())
            );
            if (firstRealContentChild) {
                 content.insertBefore(window.titulo, firstRealContentChild);
            } else {
                 content.appendChild(window.titulo);
            }
        }
    } else {
        console.error("[Navegação DOMContentLoaded] .content não encontrado.");
    }

    const menuLivrosLinks = document.querySelectorAll('.menu-livros a');
    if (menuLivrosLinks.length > 0) {
        menuLivrosLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const livroAttr = link.dataset.livro;
                if (livroAttr) {
                    loadBook(livroAttr);
                } else {
                    console.error(`[Navegação DOMContentLoaded] data-livro ausente no link:`, link);
                }
            });
        });
        console.log("[Navegação DOMContentLoaded] Listeners dos links de livros configurados.");
    } else {
        console.warn("[Navegação DOMContentLoaded] Nenhum link em '.menu-livros a'.");
    }
});