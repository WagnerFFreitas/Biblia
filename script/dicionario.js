/*===============================================================================*/
/*                    SCRIPT DO DICIONÁRIO BÍBLICO                               */
/*===============================================================================*/
/*  Este arquivo contém:                                                         */
/*                    - Funções para carregar e exibir termos do dicionário      */
/*                    - Busca local e renderização de verbetes                   */
/*===============================================================================*/

const DICIONARIO_DATA_BASE_PATH_LOCAL = '../dicionario/';                                                    // Define caminho base para dados do dicionário
let dadosDicionarioAtuaisDaLetra = [];                                                                       // Define array para armazenar dados atuais da letra

// Este bloco configura a visualização do dicionário e adiciona event listeners para busca
export function setupDicionarioView(letraInicial) {                                                          // Define função para configurar view do dicionário
    const searchInput = document.getElementById('dicionarioSearchInput');                                    // Busca o campo de busca do dicionário
    const searchBtn = document.getElementById('dicionarioSearchBtn');                                        // Busca o botão de busca do dicionário

    if (searchBtn && searchInput) {                                                                          // Verifica se os elementos existem
        const performDictionarySearch = () => {                                                              // Define função para executar busca
            const searchTerm = searchInput.value.trim().toLowerCase();                                       // Obtém termo de busca em minúsculas
            _executarBuscaLocalDicionario(searchTerm);                                                       // Executa busca local no dicionário
        };

        searchBtn.addEventListener('click', performDictionarySearch);                                        // Adiciona listener para clique no botão
        searchInput.addEventListener('keyup', e => {                                                         // Adiciona listener para tecla Enter
            if (e.key === 'Enter') performDictionarySearch();                                                // Executa busca se Enter for pressionado
        });
    }

    if (letraInicial) {                                                                                      // Verifica se há letra inicial definida
        carregarEDisplayDicionarioPorLetra(letraInicial);                                                    // Carrega dicionário para letra específica
    } else {                                                                                                 // Caso não haja letra inicial
        carregarEDisplayDicionarioPorLetra('A');                                                            // Carrega dicionário para letra A por padrão
    }
}

// Este bloco carrega e exibe dados do dicionário para uma letra específica
export async function carregarEDisplayDicionarioPorLetra(letra) {                                            // Define função assíncrona para carregar dados
    const resultadosContainer = document.getElementById('dictionary-results-container');                    // Busca container de resultados
    const highlightedLetterLarge = document.getElementById('highlightedLetterLarge');                       // Busca elemento para destacar letra

    if (!resultadosContainer) {                                                                              // Verifica se o container existe
        console.error("[DICIO] Container #dictionary-results-container não encontrado.");                   // Loga erro se não encontrar
        return;                                                                                              // Interrompe a função se não existir
    }

    resultadosContainer.innerHTML = '<div class="loader"></div>';                                            // Exibe loader enquanto carrega

    try {                                                                                                    // Inicia bloco try-catch para tratamento de erros
        const response = await fetch(`${DICIONARIO_DATA_BASE_PATH_LOCAL}${letra.toLowerCase()}.json`);       // Busca arquivo JSON da letra
        if (!response.ok) throw new Error(`Arquivo '${letra.toLowerCase()}.json' não encontrado.`);          // Lança erro se arquivo não existir
        const jsonData = await response.json();                                                              // Converte resposta para JSON
        const terms = jsonData[letra.toUpperCase()] || jsonData[letra.toLowerCase()];                        // Obtém termos da letra (maiúscula ou minúscula)
        if (!terms) throw new Error(`Dados para a letra '${letra}' não encontrados.`);                       // Lança erro se não encontrar dados

        dadosDicionarioAtuaisDaLetra = terms;                                                                // Armazena dados atuais da letra
        _renderizarTermosDicionario(terms, resultadosContainer);                                             // Renderiza termos no container
    } catch (error) {                                                                                        // Captura erros que possam ocorrer
        resultadosContainer.innerHTML = `<p class="erro-mensagem">${error.message}</p>`;                     // Exibe mensagem de erro
        dadosDicionarioAtuaisDaLetra = [];                                                                   // Limpa dados atuais em caso de erro
    }

    if (highlightedLetterLarge) highlightedLetterLarge.textContent = letra.toUpperCase();                   // Destaca letra atual se elemento existir
}

// Este bloco renderiza os termos do dicionário no container especificado
function _renderizarTermosDicionario(terms, container) {                                                     // Define função para renderizar termos
    container.innerHTML = '';                                                                                // Limpa o container antes de renderizar

    if (!terms || terms.length === 0) {                                                                      // Verifica se há termos para exibir
        container.innerHTML = '<p class="initial-message-dict">Nenhum termo encontrado para esta letra.</p>'; // Exibe mensagem se não houver termos
        return;                                                                                              // Interrompe a função se não houver dados
    }

    terms.forEach(termData => {                                                                              // Itera sobre cada termo do array
        const verbeteDiv = document.createElement('div');                                                    // Cria div para o verbete
        verbeteDiv.className = 'verbete';                                                                    // Define classe CSS para o verbete

        let content = `<h3>${termData.termo}</h3>`;                                                          // Inicia conteúdo com o termo
        if (termData.definicao) content += `<p>${termData.definicao}</p>`;                                   // Adiciona definição se existir
        if (termData.definicaoAdicional) content += `<p><em>${termData.definicaoAdicional}</em></p>`;        // Adiciona definição adicional se existir
        if (termData.referencias && termData.referencias.length > 0) {                                       // Verifica se há referências
            content += `<div><strong>Referências:</strong> ${termData.referencias.join(', ')}</div>`;        // Adiciona referências se existirem
        }

        verbeteDiv.innerHTML = content;                                                                      // Define conteúdo HTML do verbete
        container.appendChild(verbeteDiv);                                                                   // Adiciona verbete ao container
    });
}

// Este bloco executa busca local no dicionário com base no termo fornecido
function _executarBuscaLocalDicionario(termo) {                                                             // Define função para busca local
    const resultadosContainer = document.getElementById('dictionary-results-container');                    // Busca container de resultados
    if (!termo || termo.trim() === '') {                                                                     // Verifica se o termo está vazio
        _renderizarTermosDicionario(dadosDicionarioAtuaisDaLetra, resultadosContainer);                     // Renderiza todos os termos se termo vazio
        return;                                                                                              // Interrompe a função se termo vazio
    }

    const termoLowerCase = termo.toLowerCase();                                                              // Converte termo para minúsculas
    const resultadosFiltrados = dadosDicionarioAtuaisDaLetra.filter(item =>                                 // Filtra termos que correspondem à busca
        item.termo.toLowerCase().includes(termoLowerCase) ||                                                 // Verifica se termo contém busca
        (item.definicao && item.definicao.toLowerCase().includes(termoLowerCase))                            // Verifica se definição contém busca
    );

    _renderizarTermosDicionario(resultadosFiltrados, resultadosContainer);                                  // Renderiza resultados filtrados

    if (resultadosFiltrados.length === 0) {                                                                  // Verifica se não há resultados
        resultadosContainer.innerHTML = `<p class="sem-resultados">Nenhum termo encontrado para "${termo}".</p>`; // Exibe mensagem de sem resultados
    }
}