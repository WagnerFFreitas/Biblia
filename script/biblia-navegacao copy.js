// --- START OF FILE script/biblia-navegacao.js ---
// (O objeto 'livros' e as variáveis globais no topo permanecem os mesmos)

console.log("[biblia-navegacao.js] Script carregado.");

const livros = {
    "genesis": { "capitulos": 50 }, "exodo": { "capitulos": 40 }, "levitico": { "capitulos": 27 },
    "numeros": { "capitulos": 36 }, "deuteronomio": { "capitulos": 34 }, "josue": { "capitulos": 24 },
    "juizes": { "capitulos": 21 }, "rute": { "capitulos": 4 }, "1samuel": { "capitulos": 31 },
    "2samuel": { "capitulos": 24 }, "1reis": { "capitulos": 22 }, "2reis": { "capitulos": 25 },
    "1cronicas": { "capitulos": 29 }, "2cronicas": { "capitulos": 36 }, "esdras": { "capitulos": 10 },
    "neemias": { "capitulos": 13 }, "ester": { "capitulos": 10 }, "jo": { "capitulos": 42 },
    "salmos": { "capitulos": 150 }, "proverbios": { "capitulos": 31 }, "eclesiastes": { "capitulos": 12 },
    "cantares": { "capitulos": 8 }, "isaias": { "capitulos": 66 }, "jeremias": { "capitulos": 52 },
    "lamentacoes": { "capitulos": 5 }, "ezequiel": { "capitulos": 48 }, "daniel": { "capitulos": 12 },
    "oseias": { "capitulos": 14 }, "joel": { "capitulos": 3 }, "amos": { "capitulos": 9 },
    "obadias": { "capitulos": 1 },
    "jonas": { "capitulos": 4 }, "miqueias": { "capitulos": 7 }, "naum": { "capitulos": 3 },
    "habacuque": { "capitulos": 3 }, "sofonias": { "capitulos": 3 },
    "ageu": { "capitulos": 2 }, "zacarias": { "capitulos": 14 }, "malaquias": { "capitulos": 4 },
    "mateus": { "capitulos": 28 }, "marcos": { "capitulos": 16 }, "lucas": { "capitulos": 24 },
    "joao": { "capitulos": 21 }, "atos": { "capitulos": 28 }, "romanos": { "capitulos": 16 },
    "1corintios": { "capitulos": 16 }, "2corintios": { "capitulos": 13 }, "galatas": { "capitulos": 6 },
    "efesios": { "capitulos": 6 }, "filipenses": { "capitulos": 4 }, "colossenses": { "capitulos": 4 },
    "1tessalonicenses": { "capitulos": 5 },
    "2tessalonicenses": { "capitulos": 3 },
    "1timoteo": { "capitulos": 6 }, "2timoteo": { "capitulos": 4 }, "tito": { "capitulos": 3 },
    "filemom": { "capitulos": 1 }, "hebreus": { "capitulos": 13 }, "tiago": { "capitulos": 5 },
    "1pedro": { "capitulos": 5 }, "2pedro": { "capitulos": 3 }, "1joao": { "capitulos": 5 },
    "2joao": { "capitulos": 1 }, "3joao": { "capitulos": 1 }, "judas": { "capitulos": 1 },
    "apocalipse": { "capitulos": 22 }
};

window.titulo = null;
window.activeLivro = null;
window.activeCapitulo = null;
window.activeVersiculoButton = null;

function createCapitulosButtons(livro) {
    if (!livros[livro]) {
        console.error(`[Navegação] Livro inválido para criar botões de capítulo: ${livro}`);
        return document.createElement('div');
    }
    const capitulos = livros[livro].capitulos;
    const capitulosContainer = document.createElement('div');
    capitulosContainer.classList.add('capitulos');

    for (let i = 1; i <= capitulos; i++) {
        const button = document.createElement('button');
        button.textContent = `${i}`;
        button.classList.add('botao-capitulo');
        button.addEventListener('click', () => {
            toggleVersiculos(livro, i);
        });
        capitulosContainer.appendChild(button);
    }
    return capitulosContainer;
}

function createVersiculosButtons(livro, capitulo) {
    const versiculosContainer = document.createElement('div');
    versiculosContainer.classList.add('versiculos');

    if (typeof window.getSpecificVerseCount !== 'function') {
        console.error("[Navegação] Erro: Função 'getSpecificVerseCount' não está definida globalmente.");
        return versiculosContainer;
    }
    const numVersiculos = window.getSpecificVerseCount(livro, capitulo);

    if (numVersiculos === 0) {
        console.warn(`[Navegação] 0 versículos para ${livro} ${capitulo}.`);
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
    console.log(`[Navegação] Exibindo versículos para: ${livro} ${capitulo}`);
    const content = document.querySelector('.content');
    if (!content) { console.error("Elemento .content não encontrado."); return; }

    // Atualiza o título principal
    if (!window.titulo) window.titulo = content.querySelector('h2'); // Garante que window.titulo está definido
    if (window.titulo) {
        window.titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo}`;
    }

    // Remove container de versículos anterior e texto de versículo anterior, se existirem
    const existingVersiculosContent = content.querySelector('.versiculos-content');
    if (existingVersiculosContent) {
        existingVersiculosContent.remove();
    }
    const existingTextoVersiculo = content.querySelector('.versiculo-texto');
    if (existingTextoVersiculo) {
        existingTextoVersiculo.remove();
    }

    // Cria e adiciona o novo container de botões de versículo
    const versiculosContent = document.createElement('div');
    versiculosContent.classList.add('versiculos-content', 'book-content'); // Adiciona 'book-content' para consistência na limpeza geral se necessário
    versiculosContent.appendChild(createVersiculosButtons(livro, capitulo));

    // Encontra o container dos botões de capítulo (deve existir)
    const capitulosContainer = content.querySelector('.capitulos-container.book-content');
    if (capitulosContainer) {
        // Insere o container de versículos DEPOIS do container de capítulos
        capitulosContainer.parentNode.insertBefore(versiculosContent, capitulosContainer.nextSibling);
    } else {
        // Fallback se o container de capítulos não for encontrado (não deveria acontecer com loadBook correto)
        console.warn("[Navegação] .capitulos-container não encontrado. Adicionando versículos ao .content.");
        content.appendChild(versiculosContent);
    }

    window.activeCapitulo = capitulo;
    window.activeVersiculoButton = null; // Nenhum versículo selecionado ao mudar de capítulo
}

function toggleVersiculoText(livro, capitulo, versiculo, button) {
    console.log(`[Navegação] Toggle texto para: ${livro} ${capitulo}:${versiculo}`);
    const content = document.querySelector('.content');
    if (!content) return;

    if (typeof window.loadSpecificVerse !== 'function') {
         console.error("[Navegação] Erro: Função 'loadSpecificVerse' não está definida globalmente.");
         return;
    }

    // Se o botão clicado é o que já está ativo, apenas remove o texto
    if (window.activeVersiculoButton === button) {
        const existingVersiculoTextDiv = content.querySelector('.versiculo-texto');
        if (existingVersiculoTextDiv) {
            existingVersiculoTextDiv.remove();
        }
        if (window.titulo) { // Volta o título para Livro - Capítulo
            window.titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo}`;
        }
        window.activeVersiculoButton = null;
        button.classList.remove('active');
    } else { // Se é um novo botão ou nenhum estava ativo
        if (window.activeVersiculoButton) {
            window.activeVersiculoButton.classList.remove('active');
        }
        // A função loadSpecificVerse (em ara.js/arc.js) carregará o texto e ATUALIZARÁ O TÍTULO PRINCIPAL
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

    // Se o mesmo livro for clicado novamente, recolhe tudo
    if (window.activeLivro === livroKey) {
        console.log(`[Navegação] Recolhendo livro: ${livroKey}`);
        const elementsToClear = content.querySelectorAll('.capitulos-container, .versiculos-content, .versiculo-texto');
        elementsToClear.forEach(el => el.remove());
        if (window.titulo) window.titulo.textContent = '';
        window.activeLivro = null;
        window.activeCapitulo = null;
        window.activeVersiculoButton = null;
        return;
    }

    // Limpa conteúdo anterior (capítulos, versículos, texto)
    const elementsToRemove = content.querySelectorAll('.capitulos-container, .versiculos-content, .versiculo-texto');
    elementsToRemove.forEach(element => element.remove());

    // Configura o título principal para o nome do livro
    if (!window.titulo) {
        window.titulo = content.querySelector('h2');
        if (!window.titulo) {
            window.titulo = document.createElement('h2');
            content.insertBefore(window.titulo, content.firstChild);
        }
    }
    if (window.titulo) {
        window.titulo.textContent = livroKey.toUpperCase();
    }

    // Cria e adiciona o container para os botões de capítulo
    const capitulosContainer = document.createElement('div');
    capitulosContainer.classList.add('capitulos-container', 'book-content'); // 'book-content' para limpeza geral
    capitulosContainer.appendChild(createCapitulosButtons(livroKey));

    // Adiciona o container de capítulos ao .content. Se houver um título (H2), adiciona depois dele.
    if (window.titulo && window.titulo.parentNode === content) {
        content.insertBefore(capitulosContainer, window.titulo.nextSibling);
    } else {
        content.appendChild(capitulosContainer); // Fallback
    }

    window.activeLivro = livroKey;
    window.activeCapitulo = null;
    window.activeVersiculoButton = null;
}

document.addEventListener('DOMContentLoaded', () => {
    window.titulo = document.querySelector('.content h2');
    if (!window.titulo) {
        console.warn("[Navegação] Elemento H2 para título principal não encontrado no HTML inicial.");
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
                    console.error(`[Navegação] Atributo data-livro ausente no link clicado.`);
                }
            });
        });
        console.log("[Navegação] Listeners dos links de livros configurados.");
    } else {
        console.warn("[Navegação] Nenhum link encontrado em '.menu-livros a'.");
    }
});

// --- FIM DO SCRIPT biblia-navegacao.js ---