// --- START OF FILE arc.js ---

/**
 * Arquivo: arc.js
 * Descrição: Script específico para a versão ARC (Almeida Revista e Corrigida) da Bíblia.
 * Este arquivo contém as funções necessárias para carregar e exibir versículos da versão ARC,
 * a partir de arquivos HTML de capítulo, incluindo manipulação de títulos e controle do modo de leitura.
 * ATUALIZADO para corresponder à estrutura HTML com <div id="versiculo-X"> e <strong> para títulos.
 */

// Definição da versão da Bíblia para este script
window.BIBLE_VERSION = 'arc';
window.BIBLE_VERSION_FULL_NAME = 'Almeida Revista e Corrigida'; // Ajuste se necessário
console.log(`[${window.BIBLE_VERSION}.js] Script carregado. Definindo funções específicas para ARC (HTML).`);

/**
 * Obtém a contagem de versículos para um determinado livro e capítulo.
 */
window.getSpecificVerseCount = function(livro, capitulo) {
    return window.getVerseCount(livro, capitulo);
};

/**
 * Carrega e exibe um versículo específico da Bíblia ARC a partir de um arquivo HTML.
 * @param {string} livro - Nome do livro bíblico (chave, ex: "genesis")
 * @param {number} capitulo - Número do capítulo
 * @param {number} versiculo - Número do versículo
 */
window.loadSpecificVerse = async function(livro, capitulo, versiculo) {
    console.log(`[ARC HTML] Carregando: ${livro} ${capitulo}:${versiculo}`);
    
    const content = document.querySelector('.content');
    
    if (!content) {
        console.error("[ARC HTML] Elemento .content não encontrado.");
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
        const chapterHtmlPath = `../versao/${window.BIBLE_VERSION}/${livro}/${capitulo}.html`;
        const response = await fetch(chapterHtmlPath);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ao buscar HTML para ${livro} ${capitulo} de ${chapterHtmlPath}`);
        }
        const htmlString = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        // Tenta encontrar o elemento div do versículo (ex: div#versiculo-1)
        const versiculoNode = doc.querySelector(`div#versiculo-${versiculo}`);

        if (versiculoNode) {
            // Tenta encontrar o título interno (elemento <strong>) dentro do div do versículo
            const tituloStrongElement = versiculoNode.querySelector('strong');

            if (tituloStrongElement) {
                const tituloInternoH3 = document.createElement('h3');
                tituloInternoH3.classList.add('titulo-versiculo-interno');
                tituloInternoH3.textContent = tituloStrongElement.textContent.trim();
                versiculoElementDiv.appendChild(tituloInternoH3);
            }

            const textoP = document.createElement('p'); // Continuamos usando <p> para exibir o texto na página principal
            textoP.id = `versiculo-${versiculo}`; // ID na página principal

            // Extrai o texto do versículo, excluindo o texto do título (strong)
            let textoDoVersiculo = "";
            if (tituloStrongElement) {
                // Clona o nó para não modificar o 'doc' original e poder remover o strong
                const cloneNode = versiculoNode.cloneNode(true);
                const strongInClone = cloneNode.querySelector('strong');
                if (strongInClone) {
                    strongInClone.remove(); // Remove o elemento strong do nó clonado
                }
                textoDoVersiculo = cloneNode.textContent.trim(); // Pega o texto restante
            } else {
                // Não há elemento <strong>, então todo o conteúdo do div é o versículo
                textoDoVersiculo = versiculoNode.textContent.trim();
            }
            
            // Se o textoDoVersiculo estiver vazio APÓS remover o strong, pode ser que o strong ERA todo o conteúdo.
            // Isso não deve acontecer para versículos, mas é uma verificação.
            // No seu HTML, o texto do versículo vem DEPOIS do <strong>.
            textoP.textContent = textoDoVersiculo;
            versiculoElementDiv.appendChild(textoP);

        } else {
            const textoP = document.createElement('p');
            textoP.textContent = `Versículo ${versiculo} não encontrado no arquivo HTML.`;
            versiculoElementDiv.appendChild(textoP);
            console.warn(`[ARC HTML] Versículo ${versiculo} (div#versiculo-${versiculo}) não encontrado em ${chapterHtmlPath}`);
        }
    } catch (error) {
        console.error(`[ARC HTML] Erro ao carregar versículo ${livro} ${capitulo}:${versiculo}:`, error);
        const textoP = document.createElement('p');
        textoP.textContent = `Erro ao carregar versículo ${versiculo}. Verifique o console para detalhes.`;
        textoP.style.color = "red";
        versiculoElementDiv.appendChild(textoP);
    }

    content.appendChild(versiculoElementDiv);

    // Atualiza o título principal da página
    if (window.titulo) {
        let nomeLivroDisplay = livro.toUpperCase(); 
        if (typeof window.getLivroDisplayName === 'function') {
            nomeLivroDisplay = window.getLivroDisplayName(livro);
        } else {
            console.warn("[ARC HTML] Função window.getLivroDisplayName não encontrada. Usando chave do livro em maiúsculas para o título.");
        }
        window.titulo.textContent = `${nomeLivroDisplay} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}`;
    } else {
        console.warn(`[ARC HTML] Elemento H2 principal (window.titulo) não encontrado para atualizar.`);
    }
};

/**
 * Obtém o título de uma seção específica (título interno) a partir do arquivo HTML do capítulo.
 * O título é esperado como um elemento <strong> dentro do div do versículo.
 * @param {string} livro - Nome do livro bíblico (chave, ex: "genesis")
 * @param {number} capitulo - Número do capítulo
 * @param {number} versiculo - Número do versículo ao qual o título se aplica
 * @returns {string|null} - Texto do título da seção ou null se não encontrado
 */
window.getSpecificChapterTitle = async function(livro, capitulo, versiculo) {
    console.log(`[ARC HTML] Obtendo título interno para: ${livro} ${capitulo} (aplicável ao v.${versiculo})`);
    try {
        const chapterHtmlPath = `../versao/${window.BIBLE_VERSION}/${livro}/${capitulo}.html`;
        const response = await fetch(chapterHtmlPath);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ao buscar HTML para ${livro} ${capitulo} de ${chapterHtmlPath}`);
        }
        const htmlString = await response.text();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        // Tenta encontrar o div do versículo
        const versiculoNode = doc.querySelector(`div#versiculo-${versiculo}`);
        
        if (versiculoNode) {
            // Dentro do div, procura pelo elemento <strong>
            const tituloStrongElement = versiculoNode.querySelector('strong');
            return tituloStrongElement ? tituloStrongElement.textContent.trim() : null;
        }
        return null; // Se o div do versículo não for encontrado

    } catch (error) {
        console.error(`[ARC HTML] Erro ao obter título interno para ${livro} ${capitulo} (v.${versiculo}):`, error);
        return null;
    }
};

console.log(`[${window.BIBLE_VERSION}.js] Funções específicas para ARC (HTML) definidas e atualizadas para estrutura de div/strong.`);

// --- FIM DO SCRIPT arc.js ---