/**
 * Arquivo: ara.js
 * Descrição: Script específico para a versão ARA (Almeida Revisada e Atualizada) da Bíblia
 * Este arquivo contém as funções necessárias para carregar e exibir versículos da versão ARA,
 * incluindo manipulação de títulos e controle do modo de leitura.
 */

// Definição da versão da Bíblia para este script
window.BIBLE_VERSION = 'ara';
window.BIBLE_VERSION_FULL_NAME = 'Almeida Revisada e Atualizada';
console.log(`[${window.BIBLE_VERSION}.js] Script carregado. Definindo funções específicas para ARA.`);

/**
 * Obtém a contagem de versículos para um determinado livro e capítulo
 * @param {string} livro - Nome do livro bíblico
 * @param {number} capitulo - Número do capítulo
 * @returns {number} - Quantidade de versículos no capítulo
 */
window.getSpecificVerseCount = function(livro, capitulo) {
    return window.getVerseCount(livro, capitulo);
};

/**
 * Carrega e exibe um versículo específico da Bíblia ARA
 * @param {string} livro - Nome do livro bíblico
 * @param {number} capitulo - Número do capítulo
 * @param {number} versiculo - Número do versículo
 */
window.loadSpecificVerse = async function(livro, capitulo, versiculo) {
    console.log(`[ARA] Carregando: ${livro} ${capitulo}:${versiculo}`);
    
    // Obtém o container principal do conteúdo
    const content = document.querySelector('.content');
    let tituloH2 = document.querySelector('.content h2');
    
    if (!content) {
        console.error("[ARA] Elemento .content não encontrado.");
        return;
    }

    // Remove versículo anterior se existir
    const existingVersiculoDiv = content.querySelector('.versiculo-texto');
    if (existingVersiculoDiv) {
        existingVersiculoDiv.remove();
    }

    // Cria container para o novo versículo
    const versiculoElementDiv = document.createElement('div');
    versiculoElementDiv.classList.add('versiculo', 'versiculo-texto');
    
    // Adiciona classe para modo leitura se estiver ativo
    if (document.body.classList.contains('module-leitura')) {
        versiculoElementDiv.classList.add('modo-leitura');
    }

    try {
        // Busca dados do versículo no arquivo JSON correspondente
        const response = await fetch(`../version/ara/${livro}/${capitulo}.json`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ao buscar JSON para ${livro} ${capitulo}`);
        }
        const data = await response.json();

        if (data.versiculos && data.versiculos[versiculo]) {
            // Adiciona título do versículo se existir
            if (data.titulos && data.titulos[versiculo]) {
                const tituloInternoH3 = document.createElement('h3');
                tituloInternoH3.classList.add('titulo-versiculo-interno');
                tituloInternoH3.textContent = data.titulos[versiculo];
                versiculoElementDiv.appendChild(tituloInternoH3);
            }

            // Adiciona o texto do versículo
            const textoP = document.createElement('p');
            textoP.id = `versiculo-${versiculo}`;
            textoP.textContent = data.versiculos[versiculo];
            versiculoElementDiv.appendChild(textoP);

        } else {
            // Exibe mensagem de erro se o versículo não for encontrado
            const textoP = document.createElement('p');
            textoP.textContent = `Versículo ${versiculo} não encontrado nos dados.`;
            versiculoElementDiv.appendChild(textoP);
            console.warn(`[ARA] Versículo ${versiculo} não encontrado nos dados de ${livro} ${capitulo}.json`);
        }
    } catch (error) {
        // Tratamento de erros durante o carregamento
        console.error(`[ARA] Erro ao carregar versículo ${livro} ${capitulo}:${versiculo}:`, error);
        const textoP = document.createElement('p');
        textoP.textContent = `Erro ao carregar versículo ${versiculo}.`;
        textoP.style.color = "red";
        versiculoElementDiv.appendChild(textoP);
    }

    // Adiciona o elemento do versículo ao container principal
    content.appendChild(versiculoElementDiv);

    // Atualiza o título principal da página
    if (window.titulo) {
        window.titulo.textContent = `${livro.toUpperCase()} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}`;
    } else {
        console.warn(`[ARA] Elemento H2 principal (window.titulo) não encontrado para atualizar.`);
    }
};

/**
 * Obtém o título de um capítulo específico
 * @param {string} livro - Nome do livro bíblico
 * @param {number} capitulo - Número do capítulo
 * @param {number} versiculo - Número do versículo
 * @returns {string|null} - Título do capítulo ou null se não encontrado
 */
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

// Controle do modo de leitura
window.isReadingModeEnabled = false;

// --- FIM DO SCRIPT ara.js ---