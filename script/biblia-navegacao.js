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
    // Fallback caso o displayName não seja encontrado ou livroKey seja nulo/inválido
    return livroKey ? livroKey.toUpperCase() : "LIVRO DESCONHECIDO";
};

/**
 * Cria botões para navegar entre capítulos de um livro
 * @param {string} livro - Nome do livro
 * @returns {HTMLElement} Container com botões dos capítulos
 */
function createCapitulosButtons(livro) {
    if (!livros[livro]) {
        console.error(`[Navegação] Livro inválido para criar botões de capítulo: ${livro}`);
        return document.createElement('div');
    }
    const capitulos = livros[livro].capitulos;
    const capitulosContainer = document.createElement('div');
    capitulosContainer.classList.add('capitulos', 'book-content'); // Adiciona 'book-content' para estilo

    for (let i = 1; i <= capitulos; i++) {
        const button = document.createElement('button');
        button.textContent = `${i}`;
        button.classList.add('botao-capitulo');

        button.addEventListener('click', () => {
            const livroClicado = livro;
            const capituloClicado = i;

            if (window.isReadingModeEnabled && typeof window.loadChapterInReadingMode === 'function') {
                const content = document.querySelector('.content');
                const oldReadingContent = content.querySelector('.reading-mode-content');
                if (oldReadingContent) oldReadingContent.remove();
                // Limpa também botões de versículo e texto de versículo se estiverem visíveis
                const oldVersiculosContent = content.querySelector('.versiculos-content');
                if (oldVersiculosContent) oldVersiculosContent.remove();
                const oldVersiculoTexto = content.querySelector('.versiculo-texto');
                if (oldVersiculoTexto) oldVersiculoTexto.remove();


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

    // Verifica se a função necessária está disponível
    if (typeof window.getSpecificVerseCount !== 'function') {
        console.error("[Navegação] Erro: Função 'getSpecificVerseCount' não está definida globalmente.");
        return versiculosContainer;
    }

    // Obtém o número de versículos do capítulo
    const numVersiculos = window.getSpecificVerseCount(livro, capitulo);

    // Trata caso de capítulo sem versículos
    if (numVersiculos === 0) {
        console.warn(`[Navegação] 0 versículos para ${livro} ${capitulo}.`);
        const p = document.createElement('p');
        p.textContent = "Nenhum versículo encontrado para este capítulo.";
        p.style.textAlign = "center";
        versiculosContainer.appendChild(p);
        return versiculosContainer;
    }

    // Cria botões para cada versículo
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
    if (!content) { console.error("Elemento .content não encontrado."); return; }

    const existingVersiculosContent = content.querySelector('.versiculos-content');
    const existingTextoVersiculo = content.querySelector('.versiculo-texto');

    if (!window.titulo) window.titulo = content.querySelector('h2'); // Garante que window.titulo está definido

    if (window.activeLivro === livro && window.activeCapitulo === capitulo && existingVersiculosContent) {
        console.log(`[Navegação] Recolhendo versículos para: ${livro} ${capitulo}`);
        existingVersiculosContent.remove();
        if (existingTextoVersiculo) {
            existingTextoVersiculo.remove();
        }

        if (window.titulo) {
            // USA getLivroDisplayName
            window.titulo.textContent = window.getLivroDisplayName(livro);
        }
        window.activeCapitulo = null;
        window.activeVersiculoButton = null;
        return;
    }

    console.log(`[Navegação] Exibindo versículos para: ${livro} ${capitulo}`);

    if (window.titulo) {
        // USA getLivroDisplayName
        window.titulo.textContent = `${window.getLivroDisplayName(livro)} - CAPÍTULO ${capitulo}`;
    }

    if (existingVersiculosContent) {
        existingVersiculosContent.remove();
    }
    if (existingTextoVersiculo) {
        existingTextoVersiculo.remove();
    }

    const versiculosContent = document.createElement('div');
    versiculosContent.classList.add('versiculos-content', 'book-content'); // Já tem book-content
    versiculosContent.appendChild(createVersiculosButtons(livro, capitulo));

    const capitulosContainer = content.querySelector('.capitulos-container.book-content');
    if (capitulosContainer) {
        capitulosContainer.parentNode.insertBefore(versiculosContent, capitulosContainer.nextSibling);
    } else {
        console.warn("[Navegação] .capitulos-container não encontrado. Tentando adicionar após o H2 ou no .content.");
        if (window.titulo && window.titulo.parentNode === content) {
            content.insertBefore(versiculosContent, window.titulo.nextSibling);
        } else {
            content.appendChild(versiculosContent);
        }
    }

    window.activeLivro = livro;
    window.activeCapitulo = capitulo;
    window.activeVersiculoButton = null;
}

/**
 * Alterna a exibição do texto de um versículo específico
 * @param {string} livro - Nome do livro
 * @param {number} capitulo - Número do capítulo
 * @param {number} versiculo - Número do versículo
 * @param {HTMLElement} button - Botão do versículo clicado
 */
function toggleVersiculoText(livro, capitulo, versiculo, button) {
    console.log(`[Navegação] Toggle texto para: ${livro} ${capitulo}:${versiculo}`);
    const content = document.querySelector('.content');
    if (!content) return;

    if (typeof window.loadSpecificVerse !== 'function') {
         console.error("[Navegação] Erro: Função 'loadSpecificVerse' não está definida globalmente.");
         return;
    }
    if (!window.titulo) window.titulo = content.querySelector('h2'); // Garante que window.titulo está definido

    if (window.activeVersiculoButton === button) {
        const existingVersiculoTextDiv = content.querySelector('.versiculo-texto');
        if (existingVersiculoTextDiv) {
            existingVersiculoTextDiv.remove();
        }
        if (window.titulo) {
            // USA getLivroDisplayName
            window.titulo.textContent = `${window.getLivroDisplayName(livro)} - CAPÍTULO ${capitulo}`;
        }
        if(window.activeVersiculoButton) window.activeVersiculoButton.classList.remove('active'); // Remove de forma segura
        window.activeVersiculoButton = null;
        // button.classList.remove('active'); // Já tratado acima
    } else {
        if (window.activeVersiculoButton) {
            window.activeVersiculoButton.classList.remove('active');
        }
        // A função loadSpecificVerse (no arquivo da versão, ex: ara.js)
        // carregará o texto e ATUALIZARÁ O TÍTULO PRINCIPAL (H2) usando getLivroDisplayName.
        window.loadSpecificVerse(livro, capitulo, versiculo);
        window.activeVersiculoButton = button;
        button.classList.add('active');
    }
}

/**
 * Carrega um livro da Bíblia e prepara sua interface
 * @param {string} livro - Nome do livro a ser carregado
 */
function loadBook(livro) {
    console.log(`[Navegação] Carregando livro: ${livro}`);
    const content = document.querySelector('.content');
    if (!content) { console.error("Elemento .content não encontrado."); return; }

    const livroKey = Object.keys(livros).find(key => key.toLowerCase() === livro.toLowerCase());
    if (!livroKey) {
        console.error(`[Navegação] Chave de livro inválida em loadBook: ${livro}`);
        return;
    }

    if (!window.titulo) { // Garante que window.titulo está definido
        window.titulo = content.querySelector('h2');
        if (!window.titulo) { // Se ainda não existir, cria (deveria ser raro se o HTML estiver correto)
            console.warn("[Navegação] H2 não encontrado, criando um novo.");
            window.titulo = document.createElement('h2');
            const firstChildInContent = content.firstChild; // Para inserir antes do primeiro elemento
            content.insertBefore(window.titulo, firstChildInContent);
        }
    }

    if (window.activeLivro === livroKey) {
        console.log(`[Navegação] Recolhendo livro: ${livroKey}`);
        const elementsToClear = content.querySelectorAll('.capitulos-container, .versiculos-content, .versiculo-texto, .reading-mode-content');
        elementsToClear.forEach(el => el.remove());
        if (window.titulo) window.titulo.textContent = ''; // Limpa o título H2
        window.activeLivro = null;
        window.activeCapitulo = null;
        window.activeVersiculoButton = null;

        if (window.isReadingModeEnabled && typeof window.toggleReadingMode === 'function') {
             window.toggleReadingMode(false, null, null);
        }
        return;
    }

    const elementsToRemove = content.querySelectorAll('.capitulos-container, .versiculos-content, .versiculo-texto, .reading-mode-content');
    elementsToRemove.forEach(element => element.remove());

    if (window.titulo) {
        // USA getLivroDisplayName
        window.titulo.textContent = window.getLivroDisplayName(livroKey);
    }

    const capitulosContainer = document.createElement('div');
    capitulosContainer.classList.add('capitulos-container', 'book-content'); // Já tem book-content
    capitulosContainer.appendChild(createCapitulosButtons(livroKey));

    if (window.titulo && window.titulo.parentNode === content) {
        content.insertBefore(capitulosContainer, window.titulo.nextSibling);
    } else {
        content.appendChild(capitulosContainer);
        console.warn("[Navegação] window.titulo não encontrado ou não é filho de .content. Adicionando capitulosContainer ao final de .content.");
    }

    window.activeLivro = livroKey;
    window.activeCapitulo = null;
    window.activeVersiculoButton = null;

    // Limpeza adicional de modo leitura, caso tenha ficado algum resquício.
    const readingModeContent = content.querySelector('.reading-mode-content');
    if (readingModeContent) {
        readingModeContent.remove();
    }
}

// === Inicialização ===
document.addEventListener('DOMContentLoaded', () => {
    // Configura o título principal
    const content = document.querySelector('.content');
    if (content) {
        window.titulo = content.querySelector('h2');
        if (!window.titulo) {
            console.warn("[Navegação] Elemento H2 para título principal não encontrado no HTML. Criando um.");
            window.titulo = document.createElement('h2');
            // Tenta inserir após a nav-bar se ela existir dentro de .content, senão no início de .content
            const navBar = content.querySelector('.nav-bar'); // Supondo que sua nav-bar tem essa classe e está no .content
            if (navBar && navBar.parentNode === content) {
                 content.insertBefore(window.titulo, navBar.nextSibling);
            } else {
                 content.insertBefore(window.titulo, content.firstChild);
            }
        }
    } else {
        console.error("[Navegação DOMContentLoaded] Elemento .content não encontrado para configurar o título H2.");
    }

    // Configura eventos de clique nos links dos livros
    const menuLivrosLinks = document.querySelectorAll('.menu-livros a');
    if (menuLivrosLinks.length > 0) {
        menuLivrosLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const livroAttr = link.dataset.livro;
                if (livroAttr) {
                    loadBook(livroAttr);
                } else {
                    console.error(`[Navegação] Atributo data-livro ausente no link clicado:`, link);
                }
            });
        });
        console.log("[Navegação] Listeners dos links de livros configurados.");
    } else {
        console.warn("[Navegação] Nenhum link encontrado em '.menu-livros a'.");
    }
});