/*===============================================================================*/
/*            SCRIPT ESPECÍFICO PARA NAA (Nova Almeida Atualizada)               */
/*===============================================================================*/
/*  Este arquivo contém:                                                         */
/*                    - Funções para carregar e exibir versículos da versão NAA  */
/*                    - Manipulação de títulos e modo de leitura                 */
/*===============================================================================*/

// Este bloco definição da versão da Bíblia para este script
window.BIBLE_VERSION                   = 'naa';                                                              // Define o identificador da versão
window.NOME_VERSAO_COMPLETA_BIBLIA     = 'Nova Almeida Atualizada';                                          // Nome completo da versão
console.log(`[${window.BIBLE_VERSION}.js] Script carregado. Definindo funções específicas para NAA.`);       // Loga o carregamento do script

// Este bloco cria a função que será chamada por livros_capitulos.js. Obtém a contagem de versículos para um determinado livro e capítulo.
window.getSpecificVerseCount = function(livro, capitulo) {
    return window.getVerseCount(livro, capitulo);                                                            // Chama a função global para obter a contagem
};

// Este bloco carrega e exibe um versículo específico da Bíblia NAA.
window.loadSpecificVerse = async function(livro, capitulo, versiculo) {
    console.log(`[NAA] Carregando: ${livro} ${capitulo}:${versiculo}`);                                      // Loga o carregamento do versículo
    const content = document.querySelector('.content');                                                      // Seleciona o container principal
    if (!content) {                                                                                          // Verifica se o container principal existe
        console.error("[NAA] Elemento .content não encontrado.");                                            // Loga erro se não encontrar o container
        return;                                                                                              // Interrompe a função se o container não existir
    }

    const existingVersiculoDiv = content.querySelector('.texto-versiculo');                                  // Busca o versículo anterior exibido
    if (existingVersiculoDiv) {                                                                              // Remove o versículo anterior, se existir
        existingVersiculoDiv.remove();                                                                       // Remove da tela
    }

    const versiculoElementDiv = document.createElement('div');                                               // Cria um novo elemento <div> para o versículo
    versiculoElementDiv.classList.add('versiculo', 'texto-versiculo');                                       // Adiciona classes CSS para estilização
    if (document.body.classList.contains('module-leitura')) {                                                // Verifica se o modo de leitura está ativo no body
        versiculoElementDiv.classList.add('modo-leitura');                                                   // Adiciona classe se modo leitura estiver ativo
    }

    // Este bloco inicia um bloco try-catch para lidar com possíveis erros de requisição
    try {        const response = await fetch(`../versao/naa/${livro}/${capitulo}.json`);                             // Busca o arquivo JSON do capítulo
        if (!response.ok) {                                                                                  // Verifica se a requisição HTTP foi bem-sucedida
            throw new Error(`HTTP ${response.status} ao buscar JSON para ${livro} ${capitulo} (NAA)`);       // Lança um erro se a resposta não for 'ok'
        }
        const data = await response.json();                                                                  // Converte a resposta em formato JSON

        if (data.versiculos && data.versiculos[versiculo]) {                                                 // Verifica se o versículo existe nos dados carregados
            if (data.titulos && data.titulos[versiculo]) {                                                   // Verifica se existe título para o versículo
                const tituloInternoH3 = document.createElement('h3');                                        // Cria elemento para o título interno
                tituloInternoH3.classList.add('titulo-versiculo-interno');                                   // Adiciona classe ao título
                tituloInternoH3.textContent = data.titulos[versiculo];                                       // Define o texto do título
                versiculoElementDiv.appendChild(tituloInternoH3);                                            // Adiciona o título à div do versículo
            }

            const textoP = document.createElement('p');                                                      // Cria elemento <p> para o texto do versículo
            textoP.id = `versiculo-${versiculo}`;                                                            // Define o id do <p>
            textoP.textContent = data.versiculos[versiculo];                                                 // Define o texto do versículo
            versiculoElementDiv.appendChild(textoP);                                                         // Adiciona o <p> à div do versículo
        } else {                                                                                             // Caso o versículo não seja encontrado nos dados
            const textoP = document.createElement('p');                                                      // Cria elemento <p> para mensagem de erro
            textoP.textContent = `Versículo ${versiculo} não encontrado nos dados.`;                         // Define mensagem de erro
            versiculoElementDiv.appendChild(textoP);                                                         // Adiciona o <p> à div do versículo
            console.warn(`[NAA] Versículo ${versiculo} não encontrado nos dados de ${livro} ${capitulo}.json (NAA)`);
        }
    } catch (error) {                                                                                        // Captura erros que possam ocorrer no bloco try
        console.error(`[NAA] Erro ao carregar versículo ${livro} ${capitulo}:${versiculo} (NAA):`, error);   // Loga erro
        const textoP = document.createElement('p');                                                          // Cria elemento <p> para mensagem de erro
        textoP.textContent = `Erro ao carregar versículo ${versiculo}.`;                                     // Define mensagem de erro
        textoP.style.color = "red";                                                                          // Define cor vermelha para o texto
        versiculoElementDiv.appendChild(textoP);                                                             // Adiciona o <p> à div do versículo
    }

    content.appendChild(versiculoElementDiv);                                                                // Adiciona o versículo ao container

    if (window.titulo) {                                                                                     // Verifica se o elemento do título principal existe
        let nomeLivroDisplay = livro.toUpperCase();                                                          // Define nome do livro em maiúsculas como fallback
        if (typeof window.getLivroDisplayName === 'function') {                                              // Verifica se a função para obter o nome formatado do livro existe
            nomeLivroDisplay = window.getLivroDisplayName(livro);                                            // Usa a função para obter nome acentuado
        } else {                                                                                             // Caso a função não exista
            console.warn("[NAA] Função window.getLivroDisplayName não encontrada. Usando chave do livro em maiúsculas para o título.");
        }
        window.titulo.textContent = `${nomeLivroDisplay} - CAPÍTULO ${capitulo} - VERSÍCULO ${versiculo}`;   // Atualiza o texto do título da página
    } else {                                                                                                 // Caso o elemento do título não seja encontrado
        console.warn(`[NAA] Elemento H2 principal (window.titulo) não encontrado para atualizar.`);
    }
};

// Este bloco define a função para obter o título de uma seção.
window.getSpecificChapterTitle = async function(livro, capitulo, versiculo) {
    console.log(`[NAA] Obtendo título interno para: ${livro} ${capitulo}:${versiculo}`);                     // Loga a busca do título
    try {                                                                                                    // Inicia um bloco try-catch para lidar com erros
        const response = await fetch(`../versao/naa/${livro}/${capitulo}.json`);                             // Busca o arquivo JSON do capítulo
        if (!response.ok) {                                                                                  // Verifica se a requisição foi bem-sucedida
            throw new Error(`HTTP ${response.status} ao buscar JSON para ${livro} ${capitulo} (NAA)`);
        }
        const data = await response.json();                                                                  // Converte a resposta para JSON
        return data.titulos && data.titulos[versiculo] ? data.titulos[versiculo] : null;                     // Retorna o título se existir, caso contrário retorna null
    } catch (error) {                                                                                        // Captura erros que possam ocorrer
        console.error(`[NAA] Erro ao obter título interno para ${livro} ${capitulo}:${versiculo} (NAA):`, error);// Loga erro
        return null;                                                                                             // Retorna null em caso de erro
    }
};