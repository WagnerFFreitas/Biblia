// --- START OF FILE acf.js ---

/**
 * Arquivo: acf.js
 * Descrição: Script específico para a versão ACF (Almeida Corrigida Fiel) da Bíblia
 * Este arquivo contém as funções necessárias para carregar e exibir versículos da versão ACF,
 * incluindo manipulação de títulos e controle do modo de leitura.
 */

// Definição da versão da Bíblia para este script
window.BIBLE_VERSION = 'acf';
window.NOME_VERSAO_COMPLETA_BIBLIA = 'Almeida Corrigida Fiel';
console.log(`[${window.BIBLE_VERSION}.js] Script carregado. Definindo funções específicas para ACF.`);

/**
 * Obtém a contagem de versículos para um determinado livro e capítulo
 * @param {string} livro - Nome do livro bíblico
 * @param {number} capitulo - Número do capítulo
 * @returns {number} - Quantidade de versículos no capítulo
 */
window.getSpecificVerseCount = function(livro, capitulo) {
    // Presume-se que window.getVerseCount já está definido globalmente por livros_capitulos.js
    return window.getVerseCount(livro, capitulo);
};

/**
 * Carrega e exibe um versículo específico da Bíblia ACF
 * @param {string} livro - Nome do livro bíblico (chave, ex: "genesis")
 * @param {number} capitulo - Número do capítulo
 * @param {number} versiculo - Número do versículo
 */
window.loadSpecificVerse = async function(livro, capitulo, versiculo) {
    console.log(`[ACF] Carregando: ${livro} ${capitulo}:${versiculo}`);
    
    const content = document.querySelector('.conteudo');
    
    if (!content) {
        console.error("[ACF] Elemento .conteudo não encontrado.");
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
        const response = await fetch(`../versao/acf/${livro}/${capitulo}.json`); 
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ao buscar JSON para ${livro} ${capitulo} (ACF)`);
        }
        const data = await response.json();

        if (data.versiculos && data.versiculos[versiculo]) {
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
            console.warn(`[ACF] Versículo ${versiculo} não encontrado nos dados de ${livro} ${capitulo}.json (ACF)`);
        }
    } catch (error) {
        console.error(`[ACF] Erro ao carregar versículo ${livro} ${capitulo}:${versiculo} (ACF):`, error);
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
            console.warn("[ACF] Função window.getLivroDisplayName não encontrada. Usando chave do livro em maiúsculas para o título.");
        }
        window.titulo.textContent = `${nomeLivroDisplay} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}`;
    } else {
        console.warn(`[ACF] Elemento H2 principal (window.titulo) não encontrado para atualizar.`);
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
    // Nota: esta função retorna títulos INTERNOS de seções, não o título principal da página.
    console.log(`[ACF] Obtendo título interno para: ${livro} ${capitulo}:${versiculo}`);
    try {
        const response = await fetch(`../versao/acf/${livro}/${capitulo}.json`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ao buscar JSON para ${livro} ${capitulo} (ACF)`);
        }
        const data = await response.json();
        // A lógica original aqui parece correta para títulos internos de versículo/seção
        return data.titulos && data.titulos[versiculo] ? data.titulos[versiculo] : null;
    } catch (error) {
        console.error(`[ACF] Erro ao obter título interno para ${livro} ${capitulo}:${versiculo} (ACF):`, error);
        return null;
    }
};

// Controle do modo de leitura (mantido como estava, pois não é o foco do problema)
// Normalmente, o estado do modo de leitura é gerenciado centralmente por um script comum (ex: versoes.js).

// --- FIM DO SCRIPT acf.js ---