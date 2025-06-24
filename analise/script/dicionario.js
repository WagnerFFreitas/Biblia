// script/dicionario.js

const DICIONARIO_DATA_BASE_PATH_LOCAL = '../dicionario/';
let dadosDicionarioAtuaisDaLetra = [];

export function setupDicionarioView(letraInicial) {
    const searchInput = document.getElementById('dicionarioSearchInput');
    const searchBtn = document.getElementById('dicionarioSearchBtn');

    if (searchBtn && searchInput) {
        const performDictionarySearch = () => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            _executarBuscaLocalDicionario(searchTerm);
        };

        searchBtn.addEventListener('click', performDictionarySearch);
        searchInput.addEventListener('keyup', e => {
            if (e.key === 'Enter') performDictionarySearch();
        });
    }

    if (letraInicial) {
        carregarEDisplayDicionarioPorLetra(letraInicial);
    } else {
        carregarEDisplayDicionarioPorLetra('A');
    }
}

export async function carregarEDisplayDicionarioPorLetra(letra) {
    const resultadosContainer = document.getElementById('dictionary-results-container');
    const highlightedLetterLarge = document.getElementById('highlightedLetterLarge');

    if (!resultadosContainer) {
        console.error("[DICIO] Container #dictionary-results-container não encontrado.");
        return;
    }

    resultadosContainer.innerHTML = '<div class="loader"></div>';

    try {
        const response = await fetch(`${DICIONARIO_DATA_BASE_PATH_LOCAL}${letra.toLowerCase()}.json`);
        if (!response.ok) throw new Error(`Arquivo '${letra.toLowerCase()}.json' não encontrado.`);
        const jsonData = await response.json();
        const terms = jsonData[letra.toUpperCase()] || jsonData[letra.toLowerCase()];
        if (!terms) throw new Error(`Dados para a letra '${letra}' não encontrados.`);

        dadosDicionarioAtuaisDaLetra = terms;
        _renderizarTermosDicionario(terms, resultadosContainer);
    } catch (error) {
        resultadosContainer.innerHTML = `<p class="erro-mensagem">${error.message}</p>`;
        dadosDicionarioAtuaisDaLetra = [];
    }

    if (highlightedLetterLarge) highlightedLetterLarge.textContent = letra.toUpperCase();
}

function _renderizarTermosDicionario(terms, container) {
    container.innerHTML = '';

    if (!terms || terms.length === 0) {
        container.innerHTML = '<p class="initial-message-dict">Nenhum termo encontrado para esta letra.</p>';
        return;
    }

    terms.forEach(termData => {
        const verbeteDiv = document.createElement('div');
        verbeteDiv.className = 'verbete';

        let content = `<h3>${termData.termo}</h3>`;
        if (termData.definicao) content += `<p>${termData.definicao}</p>`;
        if (termData.definicaoAdicional) content += `<p><em>${termData.definicaoAdicional}</em></p>`;
        if (termData.referencias && termData.referencias.length > 0) {
            content += `<div><strong>Referências:</strong> ${termData.referencias.join(', ')}</div>`;
        }

        verbeteDiv.innerHTML = content;
        container.appendChild(verbeteDiv);
    });
}

function _executarBuscaLocalDicionario(termo) {
    const resultadosContainer = document.getElementById('dictionary-results-container');
    if (!termo || termo.trim() === '') {
        _renderizarTermosDicionario(dadosDicionarioAtuaisDaLetra, resultadosContainer);
        return;
    }

    const termoLowerCase = termo.toLowerCase();
    const resultadosFiltrados = dadosDicionarioAtuaisDaLetra.filter(item =>
        item.termo.toLowerCase().includes(termoLowerCase) ||
        (item.definicao && item.definicao.toLowerCase().includes(termoLowerCase))
    );

    _renderizarTermosDicionario(resultadosFiltrados, resultadosContainer);

    if (resultadosFiltrados.length === 0) {
        resultadosContainer.innerHTML = `<p class="sem-resultados">Nenhum termo encontrado para "${termo}".</p>`;
    }
}