// --- START OF FILE ara.js ---

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
    // Presume-se que window.getVerseCount já está definido globalmente por livros_capitulos.js
    return window.getVerseCount(livro, capitulo);
};

/**
 * Carrega e exibe um versículo específico da Bíblia ARA
 * @param {string} livro - Nome do livro bíblico (chave, ex: "genesis")
 * @param {number} capitulo - Número do capítulo
 * @param {number} versiculo - Número do versículo
 */
window.loadSpecificVerse = async function(livro, capitulo, versiculo) {
    console.log(`[ARA] Carregando: ${livro} ${capitulo}:${versiculo}`);
    
    const content = document.querySelector('.content');
    // let tituloH2 = document.querySelector('.content h2'); // Não é mais usado diretamente aqui
    
    if (!content) {
        console.error("[ARA] Elemento .content não encontrado.");
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
        const response = await fetch(`../versao/ara/${livro}/${capitulo}.json`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ao buscar JSON para ${livro} ${capitulo}`);
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
    if (window.titulo) {
        // MODIFICAÇÃO AQUI:
        let nomeLivroDisplay = livro.toUpperCase(); // Fallback
        if (typeof window.getLivroDisplayName === 'function') {
            nomeLivroDisplay = window.getLivroDisplayName(livro); // Usa a função para obter nome acentuado
        } else {
            console.warn("[ARA] Função window.getLivroDisplayName não encontrada. Usando chave do livro em maiúsculas para o título.");
        }
        window.titulo.textContent = `${nomeLivroDisplay} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}`;
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
    // Nota: esta função retorna títulos INTERNOS de seções, não o título principal da página.
    // O parâmetro `versiculo` aqui é usado para buscar `data.titulos[versiculo]`.
    console.log(`[ARA] Obtendo título interno para: ${livro} ${capitulo}:${versiculo}`);
    try {
        const response = await fetch(`../versao/ara/${livro}/${capitulo}.json`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ao buscar JSON para ${livro} ${capitulo}`);
        }
        const data = await response.json();
        // A lógica original aqui parece correta para títulos internos de versículo/seção
        return data.titulos && data.titulos[versiculo] ? data.titulos[versiculo] : null;
    } catch (error) {
        console.error(`[ARA] Erro ao obter título interno para ${livro} ${capitulo}:${versiculo}:`, error);
        return null;
    }
};

// Controle do modo de leitura (mantido como estava, pois não é o foco do problema)
// window.isReadingModeEnabled = false; // Se esta linha estava aqui, pode ser redundante se versoes.js já define.
// Normalmente, o estado do modo de leitura é gerenciado centralmente por versoes.js.

// --- FIM DO SCRIPT ara.js ---