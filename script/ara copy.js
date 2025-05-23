// --- START OF FILE script/ara.js ---

window.BIBLE_VERSION = 'ara';
window.BIBLE_VERSION_FULL_NAME = 'Almeida Revisada e Atualizada';
console.log(`[${window.BIBLE_VERSION}.js] Script carregado. Definindo funções específicas para ARA.`);

// --- Função Específica para Obter Contagem de Versículos (ARA) ---
// Esta função será chamada por biblia-navegacao.js
window.getSpecificVerseCount = function(livro, capitulo) {
    // Usa a função global definida em livros_capitulos.js
    return window.getVerseCount(livro, capitulo);
};

// --- Função Específica para Carregar Versículo (ARA - JSON) ---
// Esta função será chamada por biblia-navegacao.js
window.loadSpecificVerse = async function(livro, capitulo, versiculo) {
    console.log(`[ARA] Carregando: ${livro} ${capitulo}:${versiculo}`);
    const content = document.querySelector('.content');
    let tituloH2 = document.querySelector('.content h2'); // Pega o elemento H2 do título principal
    if (!content) {
        console.error("[ARA] Elemento .content não encontrado.");
        return;
    }

    const existingVersiculoDiv = content.querySelector('.versiculo-texto');
    if (existingVersiculoDiv) {
        existingVersiculoDiv.remove();
    }

    const versiculoElementDiv = document.createElement('div'); // DIV PAI para título e texto
    versiculoElementDiv.classList.add('versiculo', 'versiculo-texto');
    // Adiciona classe extra se o modo leitura estiver ativo
    if (document.body.classList.contains('module-leitura')) {
        versiculoElementDiv.classList.add('modo-leitura');
    }

    try {
        // Caminho específico para ARA JSON
        const response = await fetch(`../version/ara/${livro}/${capitulo}.json`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ao buscar JSON para ${livro} ${capitulo}`);
        }
        const data = await response.json();

        if (data.versiculos && data.versiculos[versiculo]) {
            // Adiciona título do versículo (se houver) como H3
            if (data.titulos && data.titulos[versiculo]) {
                const tituloInternoH3 = document.createElement('h3');
                tituloInternoH3.classList.add('titulo-versiculo-interno'); // Classe para estilização CSS
                tituloInternoH3.textContent = data.titulos[versiculo];
                versiculoElementDiv.appendChild(tituloInternoH3);
            }
            // Adiciona o texto do versículo em um parágrafo
            const textoP = document.createElement('p');
            textoP.id = `versiculo-${versiculo}`; // ID para referência interna (opcional)
            textoP.textContent = data.versiculos[versiculo];
            versiculoElementDiv.appendChild(textoP);

        } else {
            const textoP = document.createElement('p');
            textoP.textContent = `Versículo ${versiculo} não encontrado nos dados.`;
            versiculoElementDiv.appendChild(textoP);
            console.warn(`[ARA] Versículo ${versiculo} não encontrado nos dados de ${livro} ${capitulo}.json`);
        }
    } catch (error) {
        console.error(`[ARA] Erro ao carregar versículo ${livro} ${capitulo}:${versiculo}:`, error);
        const textoP = document.createElement('p');
        textoP.textContent = `Erro ao carregar versículo ${versiculo}.`;
        textoP.style.color = "red";
        versiculoElementDiv.appendChild(textoP);
    }

    content.appendChild(versiculoElementDiv);

    // Atualiza o título principal da página
    // Acessa window.titulo que é gerenciado por biblia-navegacao.js
    if (window.titulo) {
        window.titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}`;
    } else {
        console.warn(`[ARA] Elemento H2 principal (window.titulo) não encontrado para atualizar.`);
    }
};

// --- Função para Obter Título do Capítulo (ARA - JSON) ---
// Esta função será chamada por toggleReadingMode
window.getSpecificChapterTitle = async function(livro, capitulo, versiculo) {
    console.log(`[ARA] Obtendo título para: ${livro} ${capitulo}:${versiculo}`);
    try {
        const response = await fetch(`../version/ara/${livro}/${capitulo}.json`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ao buscar JSON para ${livro} ${capitulo}`);
        }
        const data = await response.json();
        return data.titulos && data.titulos[versiculo] ? data.titulos[versiculo] : null;
    } catch (error) {
        console.error(`[ARA] Erro ao obter título para ${livro} ${capitulo}:${versiculo}:`, error);
        return null;
    }
};

window.isReadingModeEnabled = false;

// --- FIM DO SCRIPT ara.js ---