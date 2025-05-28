// --- START OF FILE nthl.js ---

/**
 * Arquivo: nthl.js
 * Descrição: Script específico para a versão NTHL (Nova Tradução na Linguagem de Hoje) da Bíblia
 * Este arquivo contém as funções necessárias para carregar e exibir versículos da versão NTHL,
 * incluindo manipulação de títulos e controle do modo de leitura.
 */

// Definição da versão da Bíblia para este script
window.BIBLE_VERSION = 'nthl';
window.BIBLE_VERSION_FULL_NAME = 'Nova Tradução na Linguagem de Hoje';
console.log(`[${window.BIBLE_VERSION}.js] Script carregado. Definindo funções específicas para NTHL.`);

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
 * Carrega e exibe um versículo específico da Bíblia NTHL
 * @param {string} livro - Nome do livro bíblico (chave, ex: "genesis")
 * @param {number} capitulo - Número do capítulo
 * @param {number} versiculo - Número do versículo
 */
window.loadSpecificVerse = async function(livro, capitulo, versiculo) {
    console.log(`[NTHL] Carregando: ${livro} ${capitulo}:${versiculo}`);
    
    const content = document.querySelector('.content');
    
    if (!content) {
        console.error("[NTHL] Elemento .content não encontrado.");
        return;
    }

    const existingVersiculoDiv = content.querySelector('.versiculo-texto');
    if (existingVersiculoDiv) {
        existingVersiculoDiv.remove();
    }

    const versiculoElementDiv = document.createElement('div');
    versiculoElementDiv.classList.add('versiculo', 'versiculo-texto');
    
    if (document.body.classList.contains('module-leitura')) {
        versiculoElementDiv.classList.add('modo-leitura');
    }

    try {
        const response = await fetch(`../versao/nthl/${livro}/${capitulo}.json`); 
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ao buscar JSON para ${livro} ${capitulo} (NTHL)`);
        }
        const data = await response.json();

        if (data.versiculos && data.versiculos[versiculo]) {
            // A NTHL provavelmente tem títulos de seção internos.
            // Se os seus arquivos JSON para NTHL incluírem 'titulos', eles serão usados.
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
            textoP.textContent = `Versículo ${versiculo} não encontrado nos dados.`;
            versiculoElementDiv.appendChild(textoP);
            console.warn(`[NTHL] Versículo ${versiculo} não encontrado nos dados de ${livro} ${capitulo}.json (NTHL)`);
        }
    } catch (error) {
        console.error(`[NTHL] Erro ao carregar versículo ${livro} ${capitulo}:${versiculo} (NTHL):`, error);
        const textoP = document.createElement('p');
        textoP.textContent = `Erro ao carregar versículo ${versiculo}.`;
        textoP.style.color = "red";
        versiculoElementDiv.appendChild(textoP);
    }

    content.appendChild(versiculoElementDiv);

    // Atualiza o título principal da página
    if (window.titulo) {
        let nomeLivroDisplay = livro.toUpperCase(); // Fallback
        if (typeof window.getLivroDisplayName === 'function') {
            nomeLivroDisplay = window.getLivroDisplayName(livro); // Usa a função para obter nome acentuado
        } else {
            console.warn("[NTHL] Função window.getLivroDisplayName não encontrada. Usando chave do livro em maiúsculas para o título.");
        }
        window.titulo.textContent = `${nomeLivroDisplay} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}`;
    } else {
        console.warn(`[NTHL] Elemento H2 principal (window.titulo) não encontrado para atualizar.`);
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
    console.log(`[NTHL] Obtendo título interno para: ${livro} ${capitulo}:${versiculo}`);
    try {
        // Caminho alterado para a versão NTHL
        const response = await fetch(`../versao/nthl/${livro}/${capitulo}.json`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ao buscar JSON para ${livro} ${capitulo} (NTHL)`);
        }
        const data = await response.json();
        // A lógica para títulos internos é mantida, caso seus dados os incluam para NTHL.
        return data.titulos && data.titulos[versiculo] ? data.titulos[versiculo] : null;
    } catch (error) {
        console.error(`[NTHL] Erro ao obter título interno para ${livro} ${capitulo}:${versiculo} (NTHL):`, error);
        return null;
    }
};

// Controle do modo de leitura (mantido como estava)
// Normalmente, o estado do modo de leitura é gerenciado centralmente por um script comum.

// --- FIM DO SCRIPT nthl.js ---