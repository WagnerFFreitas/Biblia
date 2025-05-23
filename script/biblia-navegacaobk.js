// --- biblia-navegacao.js - Arquivo completo com correção de navegação entre livros ---

console.log("[biblia-navegacao.js] Script carregado.");

// 1. ADICIONAR displayName A CADA LIVRO
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

window.titulo = null;
window.activeLivro = null;
window.activeCapitulo = null;
window.activeVersiculoButton = null;
// window.isReadingModeEnabled é normalmente definido no script principal (ex: versoes.html)

// 2. CRIAR A FUNÇÃO getLivroDisplayName
window.getLivroDisplayName = function(livroKey) {
    if (livros[livroKey] && livros[livroKey].displayName) {
        return livros[livroKey].displayName;
    }
    // Fallback caso o displayName não seja encontrado ou livroKey seja nulo/inválido
    return livroKey ? livroKey.toUpperCase() : "LIVRO DESCONHECIDO";
};

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

function createVersiculosButtons(livro, capitulo) {
    const versiculosContainer = document.createElement('div');
    versiculosContainer.classList.add('versiculos', 'book-content'); // Adiciona 'book-content' para estilo

    if (typeof window.getSpecificVerseCount !== 'function') {
        console.error("[Navegação] Erro: Função 'getSpecificVerseCount' não está definida globalmente.");
        return versiculosContainer;
    }
    const numVersiculos = window.getSpecificVerseCount(livro, capitulo);

    if (numVersiculos === 0) {
        console.warn(`[Navegação] 0 versículos para ${livro} ${capitulo}.`);
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

// A função toggleViewMode foi removida pois a lógica de modo leitura/lista é
// melhor gerenciada pelo script principal (versoes.html) com window.isReadingModeEnabled.

document.addEventListener('DOMContentLoaded', () => {
    // Garante que window.titulo seja definido corretamente no carregamento
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
    }

    // Inicializa os links de livros no menu lateral
    const menuLinks = document.querySelectorAll('.menu-livros a');
    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const livroId = href.substring(1); // Remove o # do início
            link.addEventListener('click', (e) => {
                e.preventDefault();
                loadBook(livroId);
            });
        }
    });
});

// Expõe funções globalmente para uso em outros scripts
window.loadBook = loadBook;
window.toggleVersiculos = toggleVersiculos;

// Função auxiliar para obter o próximo livro na ordem bíblica
// Mantida como função local para não interferir no escopo global
function obterProximoLivro(livroAtual) {
    // Lista ordenada de livros da Bíblia
    const ordemLivros = [
        "genesis", "exodo", "levitico", "numeros", "deuteronomio",
        "josue", "juizes", "rute", "1samuel", "2samuel",
        "1reis", "2reis", "1cronicas", "2cronicas", "esdras",
        "neemias", "ester", "jo", "salmos", "proverbios",
        "eclesiastes", "cantares", "isaias", "jeremias", "lamentacoes",
        "ezequiel", "daniel", "oseias", "joel", "amos",
        "obadias", "jonas", "miqueias", "naum", "habacuque",
        "sofonias", "ageu", "zacarias", "malaquias", "mateus",
        "marcos", "lucas", "joao", "atos", "romanos",
        "1corintios", "2corintios", "galatas", "efesios", "filipenses",
        "colossenses", "1tessalonicenses", "2tessalonicenses", "1timoteo", "2timoteo",
        "tito", "filemom", "hebreus", "tiago", "1pedro",
        "2pedro", "1joao", "2joao", "3joao", "judas",
        "apocalipse"
    ];
    
    const indiceAtual = ordemLivros.indexOf(livroAtual.toLowerCase());
    if (indiceAtual === -1 || indiceAtual === ordemLivros.length - 1) {
        return null; // Livro não encontrado ou é o último livro
    }
    
    return ordemLivros[indiceAtual + 1];
}

// Função auxiliar para obter o livro anterior na ordem bíblica
// Mantida como função local para não interferir no escopo global
function obterLivroAnterior(livroAtual) {
    // Lista ordenada de livros da Bíblia
    const ordemLivros = [
        "genesis", "exodo", "levitico", "numeros", "deuteronomio",
        "josue", "juizes", "rute", "1samuel", "2samuel",
        "1reis", "2reis", "1cronicas", "2cronicas", "esdras",
        "neemias", "ester", "jo", "salmos", "proverbios",
        "eclesiastes", "cantares", "isaias", "jeremias", "lamentacoes",
        "ezequiel", "daniel", "oseias", "joel", "amos",
        "obadias", "jonas", "miqueias", "naum", "habacuque",
        "sofonias", "ageu", "zacarias", "malaquias", "mateus",
        "marcos", "lucas", "joao", "atos", "romanos",
        "1corintios", "2corintios", "galatas", "efesios", "filipenses",
        "colossenses", "1tessalonicenses", "2tessalonicenses", "1timoteo", "2timoteo",
        "tito", "filemom", "hebreus", "tiago", "1pedro",
        "2pedro", "1joao", "2joao", "3joao", "judas",
        "apocalipse"
    ];
    
    const indiceAtual = ordemLivros.indexOf(livroAtual.toLowerCase());
    if (indiceAtual <= 0) {
        return null; // Livro não encontrado ou é o primeiro livro
    }
    
    return ordemLivros[indiceAtual - 1];
}

// Modificação da função loadChapterInReadingMode para suportar navegação entre livros
window.loadChapterInReadingMode = async function(livro, capitulo) {
    const contentArea = document.querySelector('section.content');
    if (!contentArea) { console.error('section.content não encontrado.'); return; }

    const normalVerseTextDisplayImmediate = contentArea.querySelector('.versiculo-texto'); 
    const verseButtonsDisplayImmediate = contentArea.querySelector('.versiculos');
    if (normalVerseTextDisplayImmediate) normalVerseTextDisplayImmediate.style.display = 'none';
    if (verseButtonsDisplayImmediate) verseButtonsDisplayImmediate.style.display = 'none';

    let readingContainer = contentArea.querySelector('.reading-mode-content');
    if (!readingContainer) {
        readingContainer = document.createElement('div');
        readingContainer.className = 'reading-mode-content';
        const chaptersContainer = contentArea.querySelector('.capitulos') || contentArea.querySelector('.capitulos-container');
        const titleH2 = contentArea.querySelector('h2');
        if (chaptersContainer) {
            chaptersContainer.insertAdjacentElement('afterend', readingContainer);
        } else if (titleH2) {
            titleH2.insertAdjacentElement('afterend', readingContainer);
        } else {
            contentArea.appendChild(readingContainer); 
        }
    }
    readingContainer.innerHTML = '<div class="loading-message" style="text-align:center; padding:20px;">Carregando capítulo...</div>';
    readingContainer.style.display = 'block';

    try {
        const versaoAtual = localStorage.getItem('versaoBiblicaSelecionada') || 'ara';
        const capituloNum = parseInt(capitulo);
        let numVersiculos = 0;
        if (typeof window.getSpecificVerseCount === 'function') {
            numVersiculos = window.getSpecificVerseCount(livro, capituloNum);
        }

        // Tenta carregar o arquivo JSON com tratamento de erro aprimorado
        let response;
        let data;
        let fetchUrl = `../version/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capituloNum}.json`;
        
        try {
            console.log(`Tentando carregar: ${fetchUrl}`);
            response = await fetch(fetchUrl);
            if (!response.ok) throw new Error(`Erro ${response.status}`);
            data = await response.json();
        } catch (fetchError) {
            console.error(`Falha ao carregar ${fetchUrl}:`, fetchError);
            
            // Tenta caminhos alternativos
            const alternativePaths = [
                `/biblia/version/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capituloNum}.json`,
                `../../version/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capituloNum}.json`,
                `/version/${versaoAtual.toLowerCase()}/${livro.toLowerCase()}/${capituloNum}.json`
            ];
            
            let loaded = false;
            for (const path of alternativePaths) {
                try {
                    console.log(`Tentando caminho alternativo: ${path}`);
                    response = await fetch(path);
                    if (response.ok) {
                        data = await response.json();
                        loaded = true;
                        console.log(`Carregado com sucesso de: ${path}`);
                        break;
                    }
                } catch (e) {
                    console.log(`Falha no caminho alternativo: ${path}`);
                }
            }
            
            if (!loaded) {
                throw new Error(`Não foi possível carregar o capítulo de nenhum caminho tentado.`);
            }
        }

        const effectiveNumVersiculos = numVersiculos > 0 ? numVersiculos : (data.versiculos ? Object.keys(data.versiculos).length : 0);

        if (effectiveNumVersiculos === 0 && (!data.versiculos || Object.keys(data.versiculos).length === 0)) {
            throw new Error('Nenhum versículo.');
        }

        // Determina o livro e capítulo anterior
        let prevLivro = livro;
        let prevCapitulo = capituloNum - 1;
        let prevDisabled = false;
        
        if (prevCapitulo < 1) {
            // Se estamos no primeiro capítulo, tenta obter o livro anterior
            const livroAnterior = obterLivroAnterior(livro);
            if (livroAnterior && window.livros && window.livros[livroAnterior]) {
                prevLivro = livroAnterior;
                prevCapitulo = window.livros[livroAnterior].capitulos || 1;
            } else {
                prevDisabled = true; // Não há livro anterior ou capítulo anterior
            }
        }

        // Determina o próximo livro/capítulo
        let nextLivro = livro;
        let nextCapitulo = capituloNum + 1;
        let nextDisabled = false;

        // Verifica se estamos no último capítulo do livro atual
        if (window.livros[livro.toLowerCase()]) {
            const totalCapitulos = window.livros[livro.toLowerCase()].capitulos;
            if (capituloNum >= totalCapitulos) {
                // Estamos no último capítulo, procura o próximo livro
                const livrosArray = Object.keys(window.livros);
                const currentIndex = livrosArray.indexOf(livro.toLowerCase());
                if (currentIndex >= 0 && currentIndex < livrosArray.length - 1) {
                    nextLivro = livrosArray[currentIndex + 1];
                    nextCapitulo = 1; // Primeiro capítulo do próximo livro
                    console.log(`[Navegação] Próximo livro: ${nextLivro}, capítulo: ${nextCapitulo}`);
                } else {
                    nextDisabled = true; // Último livro/capítulo da Bíblia
                }
            }
        }

        // Cria os botões de navegação
        let navButtonsHtml = '<div class="reading-mode-navigation">'; 
        navButtonsHtml += `<button id="prev-chapter-reading-mode" data-livro="${prevLivro}" data-capitulo="${prevCapitulo}" ${prevDisabled ? 'disabled' : ''}>Cap. Anterior</button>`;
        navButtonsHtml += `<button id="next-chapter-reading-mode" data-livro="${nextLivro}" data-capitulo="${nextCapitulo}" ${nextDisabled ? 'disabled' : ''}>Cap. Próximo</button>`;
        navButtonsHtml += '</div>';

        let htmlVerses = '<div class="chapter-verses">';
        for (let i = 1; i <= effectiveNumVersiculos; i++) {
            const verseKey = String(i);
            if (data.versiculos && data.versiculos[verseKey]) {
                if (data.titulos && data.titulos[verseKey]) htmlVerses += `<h3 class="verse-section-title">${data.titulos[verseKey]}</h3>`;
                htmlVerses += `<div class="verse-container"><sup class="verse-number">${i}</sup><span class="verse-text">${data.versiculos[verseKey]}</span></div>`;
            }
        }
        htmlVerses += '</div>';
        
        readingContainer.innerHTML = navButtonsHtml + htmlVerses; 

        // Adiciona event listeners aos botões de navegação
        const prevBtn = readingContainer.querySelector('#prev-chapter-reading-mode');
        if (prevBtn && !prevBtn.disabled) {
            prevBtn.addEventListener('click', () => {
                window.activeLivro = prevBtn.dataset.livro; 
                window.activeCapitulo = parseInt(prevBtn.dataset.capitulo);
                window.loadChapterInReadingMode(window.activeLivro, window.activeCapitulo);
                if (typeof window.updateChapterTitle === 'function') {
                    window.updateChapterTitle(window.activeLivro, window.activeCapitulo);
                }
            });
        }
        
        const nextBtn = readingContainer.querySelector('#next-chapter-reading-mode');
        if (nextBtn && !nextBtn.disabled) {
            nextBtn.addEventListener('click', () => {
                const nextLivro = nextBtn.dataset.livro;
                const nextCapitulo = parseInt(nextBtn.dataset.capitulo);
                console.log(`[Navegação] Carregando próximo: ${nextLivro} ${nextCapitulo}`);
                window.loadChapterInReadingMode(nextLivro, nextCapitulo);
            });
        }
        
        // Atualiza o título
        const titleH2 = contentArea.querySelector('h2');
        if(titleH2) {
            const livroDisplay = window.getLivroDisplayName ? window.getLivroDisplayName(livro) : livro.toUpperCase();
            titleH2.textContent = `${livroDisplay} - CAPÍTULO ${capituloNum}`;
        }
        
    } catch (error) {
        console.error('Erro modo leitura:', error);
        readingContainer.innerHTML = `
            <div class="error-container">
                <p>⚠️ Erro: ${error.message}</p>
                <p>Detalhes: Erro ao tentar carregar o capítulo ${capitulo} de ${livro}.</p>
                <p>Tente recarregar a página ou verificar a conexão com a internet.</p>
            </div>`;
    }
};
