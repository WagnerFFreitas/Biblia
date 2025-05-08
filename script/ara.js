// --- START OF FILE script/ara.js ---

window.BIBLE_VERSION = 'ara';
console.log(`[${window.BIBLE_VERSION}.js] Script carregado. Definindo funções específicas para ARA.`);

// --- Dados Específicos de Contagem de Versículos (ARA) ---
// Esta função será chamada por biblia-navegacao.js
window.getSpecificVerseCount = function(livro, capitulo) {
    // ***** COLE AQUI O OBJETO versiculosPorCapitulo COMPLETO E CORRETO DA ARA *****
    const versiculosPorCapitulo = {
        "genesis": { 1: 31, 2: 25, 3: 24, 4: 26, 5: 32, 6: 22, 7: 24, 8: 22, 9: 29, 10: 32, 11: 32, 12: 20, 13: 18, 14: 24, 15: 21, 16: 16, 17: 27, 18: 33, 19: 38, 20: 18, 21: 34, 22: 24, 23: 20, 24: 67, 25: 34, 26: 35, 27: 46, 28: 22, 29: 35, 30: 43, 31: 55, 32: 32, 33: 20, 34: 31, 35: 29, 36: 43, 37: 36, 38: 30, 39: 23, 40: 23, 41: 57, 42: 38, 43: 34, 44: 34, 45: 28, 46: 34, 47: 31, 48: 22, 49: 33, 50: 26 },
        "exodo": { 1: 22, 2: 25, 3: 22, 4: 31, 5: 23, 6: 30, 7: 25, 8: 32, 9: 35, 10: 29, 11: 10, 12: 51, 13: 22, 14: 31, 15: 27, 16: 36, 17: 16, 18: 27, 19: 25, 20: 26, 21: 36, 22: 31, 23: 33, 24: 18, 25: 40, 26: 37, 27: 21, 28: 43, 29: 46, 30: 38, 31: 18, 32: 35, 33: 23, 34: 35, 35: 35, 36: 38, 37: 29, 38: 31, 39: 43, 40: 38 },
        // ... (COLE TODOS OS OUTROS LIVROS DA ARA AQUI) ...
        "apocalipse": { 1: 20, 2: 29, 3: 22, 4: 11, 5: 14, 6: 17, 7: 17, 8: 13, 9: 21, 10: 11, 11: 19, 12: 17, 13: 18, 14: 20, 15: 8, 16: 21, 17: 18, 18: 24, 19: 21, 20: 15, 21: 27, 22: 21 }
    };
    // ***** FIM DOS DADOS ARA *****

    const contagem = versiculosPorCapitulo[livro]?.[capitulo];
    if (typeof contagem === 'undefined') {
        console.warn(`[ARA] Contagem não encontrada para ${livro} ${capitulo}`);
        return 0;
    }
    return contagem;
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

// --- FIM DO SCRIPT ara.js ---