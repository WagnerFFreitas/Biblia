// --- START OF FILE script/arc.js ---

window.BIBLE_VERSION = 'arc';
console.log(`[${window.BIBLE_VERSION}.js] Script carregado. Definindo funções específicas para ARC.`);

// --- Dados Específicos de Contagem de Versículos (ARC) ---
window.getSpecificVerseCount = function(livro, capitulo) {
    // ***** COLE AQUI O OBJETO versiculosPorCapitulo COMPLETO E CORRETO DA ARC *****
    const versiculosPorCapitulo = {
        "genesis": { 1: 31, 2: 25, 3: 24, 4: 26, 5: 32, 6: 22, 7: 24, 8: 22, 9: 29, 10: 32, 11: 32, 12: 20, 13: 18, 14: 24, 15: 21, 16: 16, 17: 27, 18: 33, 19: 38, 20: 18, 21: 34, 22: 24, 23: 20, 24: 67, 25: 34, 26: 35, 27: 46, 28: 22, 29: 35, 30: 43, 31: 55, 32: 32, 33: 20, 34: 31, 35: 29, 36: 43, 37: 36, 38: 30, 39: 23, 40: 23, 41: 57, 42: 38, 43: 34, 44: 34, 45: 28, 46: 34, 47: 31, 48: 22, 49: 33, 50: 26 },
        "exodo": { 1: 22, 2: 25, 3: 22, 4: 31, 5: 23, 6: 30, 7: 25, 8: 32, 9: 35, 10: 29, 11: 10, 12: 51, 13: 22, 14: 31, 15: 27, 16: 36, 17: 16, 18: 27, 19: 25, 20: 26, 21: 36, 22: 31, 23: 33, 24: 18, 25: 40, 26: 37, 27: 21, 28: 43, 29: 46, 30: 38, 31: 18, 32: 35, 33: 23, 34: 35, 35: 35, 36: 38, 37: 29, 38: 31, 39: 43, 40: 38 },
        // ... (COLE TODOS OS OUTROS LIVROS DA ARC AQUI) ...
        "apocalipse": { 1: 20, 2: 29, 3: 22, 4: 11, 5: 14, 6: 17, 7: 17, 8: 13, 9: 21, 10: 11, 11: 19, 12: 17, 13: 18, 14: 20, 15: 8, 16: 21, 17: 18, 18: 24, 19: 21, 20: 15, 21: 27, 22: 21 }
    };
    // ***** FIM DOS DADOS ARC *****

    const contagem = versiculosPorCapitulo[livro]?.[capitulo];
    if (typeof contagem === 'undefined') {
        console.warn(`[ARC] Contagem não encontrada para ${livro} ${capitulo}`);
        return 0;
    }
    return contagem;
};

// --- Função Específica para Carregar Versículo (ARC - HTML) ---
// Esta versão NÃO converte <strong> para <h3>, permitindo que o CSS estilize o <strong>.
window.loadSpecificVerse = async function(livro, capitulo, versiculo) {
    console.log(`[ARC] Carregando (sem conversão de strong): ${livro} ${capitulo}:${versiculo}`);
    const content = document.querySelector('.content');
    let tituloH2 = window.titulo || document.querySelector('.content h2');

    if (!content) {
        console.error("[ARC] Elemento .content não encontrado no DOM.");
        return;
    }

    const existingVersiculoDiv = content.querySelector('.versiculo-texto');
    if (existingVersiculoDiv) {
        existingVersiculoDiv.remove();
    }

    const versiculoElementDiv = document.createElement('div');
    versiculoElementDiv.classList.add('versiculo', 'versiculo-texto');

    try {
        const response = await fetch(`../version/arc/${livro}/${capitulo}.html`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ao buscar HTML para ${livro} ${capitulo}`);
        }
        const htmlText = await response.text();

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlText;
        const versiculoContentElement = tempDiv.querySelector(`#versiculo-${versiculo}`);

        if (versiculoContentElement) {
            // Insere o HTML do versículo diretamente, incluindo a tag <strong> original
            versiculoElementDiv.innerHTML = versiculoContentElement.innerHTML;
        } else {
            versiculoElementDiv.innerHTML = `<p>Versículo ${versiculo} não encontrado no arquivo HTML.</p>`;
            console.warn(`[ARC] Elemento #versiculo-${versiculo} não encontrado no HTML de ${livro}/${capitulo}.html`);
        }
    } catch (error) {
        console.error(`[ARC] Erro ao carregar ou processar versículo ${livro} ${capitulo}:${versiculo}:`, error);
        versiculoElementDiv.innerHTML = `<p style="color:red;">Erro ao carregar versículo ${versiculo}.</p>`;
    }

    content.appendChild(versiculoElementDiv);

    if (tituloH2) {
        tituloH2.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}`;
    } else {
        console.warn(`[ARC] Elemento H2 principal (titulo ou window.titulo) não encontrado para atualização.`);
    }
};

// --- FIM DO SCRIPT arc.js ---