/*===============================================================================*/
/*                                                           */
/*===============================================================================*/
/*  :                                            */
/*                                   -   */
/*                                   -               */
/*===============================================================================*/

/**
 * Arquivo: kjv.js
 * Descrição: Script específico para a versão KJV (King James Version) da Bíblia
 * Este arquivo contém as funções necessárias para carregar e exibir versículos da versão KJV,
 * incluindo manipulação de títulos e controle do modo de leitura.
 */

// Definição da versão da Bíblia para este script
window.BIBLE_VERSION = 'kjv';
window.NOME_VERSAO_COMPLETA_BIBLIA = 'Versão King James';
console.log(`[${window.BIBLE_VERSION}.js] Script carregado. Definindo funções específicas para KJV.`);

/**
 * Obtém a contagem de versículos para um determinado livro e capítulo
 * @param {string} livro - Nome do livro bíblico (chave, ex: "genesis")
 * @param {number} capitulo - Número do capítulo
 * @returns {number} - Quantidade de versículos no capítulo
 */
window.getSpecificVerseCount = function(livro, capitulo) {
    // Presume-se que window.getVerseCount já está definido globalmente por livros_capitulos.js
    return window.getVerseCount(livro, capitulo);
};

/**
 * Carrega e exibe um versículo específico da Bíblia KJV
 * @param {string} livro - Nome do livro bíblico (chave, ex: "genesis")
 * @param {number} capitulo - Número do capítulo
 * @param {number} versiculo - Número do versículo
 */
window.loadSpecificVerse = async function(livro, capitulo, versiculo) {
    console.log(`[KJV] Carregando: ${livro} ${capitulo}:${versiculo}`);
    
    const content = document.querySelector('.content');
    
    if (!content) {
        console.error("[KJV] Elemento .content não encontrado.");
        return;
    }

    const existingVersiculoDiv = content.querySelector('.texto-versiculo');
    if (existingVersiculoDiv) {
        existingVersiculoDiv.remove();
    }

    const versiculoElementDiv = document.createElement('div');
    versiculoElementDiv.classList.add('versiculo', 'texto-versiculo');
    
    if (document.body.classList.contains('module-leitura')) {
        versiculoElementDiv.classList.add('modo-leitura');
    }

    try {
        const response = await fetch(`../versao/kjv/${livro}/${capitulo}.json`); 
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ao buscar JSON para ${livro} ${capitulo} (KJV)`);
        }
        const data = await response.json();

        if (data.versiculos && data.versiculos[versiculo]) {
            // A KJV tradicional geralmente não tem títulos de seção internos como a ARA.
            // Se os seus arquivos JSON para KJV incluírem 'titulos', eles serão usados.
            // Caso contrário, esta seção será ignorada.
            if (data.titulos && data.titulos[versiculo]) {
                const tituloInternoH3 = document.createElement('h3');
                tituloInternoH3.classList.add('titulo-versiculo-interno');
                tituloInternoH3.textContent = data.titulos[versiculo];
                versiculoElementDiv.appendChild(tituloInternoH3);
            }

            const textoP = document.createElement('p');
            textoP.id = `versiculo-${versiculo}`;
            textoP.textContent = data.versiculos[versiculo];
            versiculoElementDiv.appendChild(textoP);

        } else {
            const textoP = document.createElement('p');
            textoP.textContent = `Verse ${versiculo} not found in data.`; // English for KJV context
            versiculoElementDiv.appendChild(textoP);
            console.warn(`[KJV] Verse ${versiculo} not found in data for ${livro} ${capitulo}.json (KJV)`);
        }
    } catch (error) {
        console.error(`[KJV] Error loading verse ${livro} ${capitulo}:${versiculo} (KJV):`, error);
        const textoP = document.createElement('p');
        textoP.textContent = `Error loading verse ${versiculo}.`; // English for KJV context
        textoP.style.color = "red";
        versiculoElementDiv.appendChild(textoP);
    }

    content.appendChild(versiculoElementDiv);

    // Atualiza o título principal da página
    if (window.titulo) {
        let nomeLivroDisplay = livro.toUpperCase(); // Fallback
        if (typeof window.getLivroDisplayName === 'function') {
            // Assumindo que getLivroDisplayName pode retornar nomes em inglês ou conforme configurado
            nomeLivroDisplay = window.getLivroDisplayName(livro, 'en'); // Sugerindo 'en' para KJV
        } else {
            console.warn("[KJV] Função window.getLivroDisplayName não encontrada. Usando chave do livro em maiúsculas para o título.");
        }
        // Título em inglês para KJV
        window.titulo.textContent = `${nomeLivroDisplay} - CHAPTER ${capitulo} - VERSE ${versiculo}`;
    } else {
        console.warn(`[KJV] Main H2 element (window.titulo) not found for update.`);
    }
};

/**
 * Obtém o título de um capítulo específico (na verdade, título de seção interna associado a um versículo)
 * @param {string} livro - Nome do livro bíblico
 * @param {number} capitulo - Número do capítulo
 * @param {number} versiculo - Número do versículo (usado para buscar data.titulos[versiculo])
 * @returns {string|null} - Título da seção ou null se não encontrado
 */
window.getSpecificChapterTitle = async function(livro, capitulo, versiculo) {
    // Nota: esta função retorna títulos INTERNOS de seções.
    // A KJV tradicional não os possui, mas se os seus JSONs tiverem, serão retornados.
    console.log(`[KJV] Getting internal title for: ${livro} ${capitulo}:${versiculo}`);
    try {
        const response = await fetch(`../versao/kjv/${livro}/${capitulo}.json`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ao buscar JSON para ${livro} ${capitulo} (KJV)`);
        }
        const data = await response.json();
        // A KJV tradicional não tem esses títulos, mas a lógica é mantida caso seus dados os incluam.
        return data.titulos && data.titulos[versiculo] ? data.titulos[versiculo] : null;
    } catch (error) {
        console.error(`[KJV] Error getting internal title for ${livro} ${capitulo}:${versiculo} (KJV):`, error);
        return null;
    }
};

// Controle do modo de leitura (mantido como estava)
// Normalmente, o estado do modo de leitura é gerenciado centralmente por um script comum.

// --- FIM DO SCRIPT kjv.js ---