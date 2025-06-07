// script/concordancia.js

import { getTestamentoDoLivroConfig, getOrdemDosLivrosConfig, findLivroByIdConfig } from './dropdown_concordancia.js';

const CONCORDANCIA_DATA_BASE_PATH_LOCAL = '../concordancia/';
let dadosCarregadosPorLetraOuBusca = [];
let filtroTestamentoAtual = 'todos';
let filtroLivroAtual = 'todos';
let filtroPalavraAtual = ''; // State for the word filter
let termoBuscaGlobalAtual = '';

export async function carregarEDisplayConcordanciaPorLetra(letra) {
    const resultadosContainer = document.getElementById('resultados-container');
    
    if (!resultadosContainer) return;

    resultadosContainer.innerHTML = '<div class="loader">Carregando...</div>';

    try {
        const response = await fetch(`${CONCORDANCIA_DATA_BASE_PATH_LOCAL}${letra.toLowerCase()}.json`);
        if (!response.ok) throw new Error(`Arquivo '${letra.toLowerCase()}.json' não encontrado.`);
        
        const jsonData = await response.json();
        const wordEntries = jsonData[letra.toLowerCase()] || jsonData[letra.toUpperCase()] || [];
        
        dadosCarregadosPorLetraOuBusca = wordEntries;
        termoBuscaGlobalAtual = '';
        _aplicarFiltrosERenderizar();
        
    } catch (error) {
        resultadosContainer.innerHTML = `<p class="erro-mensagem">${error.message}</p>`;
        dadosCarregadosPorLetraOuBusca = [];
    }
}

export function onConcordanciaViewReady() {
    const testamentoSelect = document.getElementById('custom-testamento-select')?.querySelector('.select-selected');
    const livroSelect = document.getElementById('custom-livro-select')?.querySelector('.select-selected');
    const palavraInput = document.getElementById('filtro-palavra-input');

    filtroTestamentoAtual = testamentoSelect?.dataset.value || 'todos';
    filtroLivroAtual = livroSelect?.dataset.value || 'todos';
    filtroPalavraAtual = palavraInput?.value.toLowerCase().trim() || '';

    if (dadosCarregadosPorLetraOuBusca.length === 0 && !termoBuscaGlobalAtual) {
        _renderizarResultados([]);
    } else {
        _aplicarFiltrosERenderizar();
    }
}

export function carregarDadosBaseConcordancia(dados) {
    dadosCarregadosPorLetraOuBusca = dados || [];
    termoBuscaGlobalAtual = '';
    filtroPalavraAtual = ''; // Reset word filter on new letter data
    _aplicarFiltrosERenderizar();
}

export function atualizarFiltroTestamento(novoTestamento) {
    if (filtroTestamentoAtual === novoTestamento) return;
    filtroTestamentoAtual = novoTestamento;
    _aplicarFiltrosERenderizar();
}

export function atualizarFiltroLivro(novoLivro) {
    if (filtroLivroAtual === novoLivro) return;
    filtroLivroAtual = novoLivro;
    _aplicarFiltrosERenderizar();
}

export function atualizarFiltroPalavra(novaPalavra) {
    const palavraFiltrada = novaPalavra.toLowerCase().trim();
    if (filtroPalavraAtual === palavraFiltrada) return;
    filtroPalavraAtual = palavraFiltrada;
    _aplicarFiltrosERenderizar();
}

function extrairNomeLivroDaReferencia(referencia) {
    if (!referencia) return '';
    const match = referencia.match(/^([A-Za-zÀ-ÿ\s0-9]+)(?=\s*\d)/);
    return match ? match[1].trim() : referencia.split(' ')[0].trim();
}
function destacarPalavra(texto, termo) {
    if (!termo || !texto) return texto;
    const regex = new RegExp(`\\b(${termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi');
    return texto.replace(regex, '<mark style="background-color: #ffff00; color: #000; padding: 1px 2px; border-radius: 2px;">$1</mark>');
}

function _aplicarFiltrosERenderizar() {
    let resultados = [...dadosCarregadosPorLetraOuBusca];

    // Filtro por Palavra (do input local)
    if (filtroPalavraAtual) {
        resultados = resultados.filter(item =>
            (item.palavra || '').toLowerCase().includes(filtroPalavraAtual)
        );
    }

    // Filtro por Testamento
    if (filtroTestamentoAtual !== 'todos') {
        resultados = resultados.reduce((acc, palavraItem) => {
            const filtradas = (palavraItem.concordancias || []).filter(con => {
                const nomeLivro = extrairNomeLivroDaReferencia(con.referencia)
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                const testamento = getTestamentoDoLivroConfig(nomeLivro);
                return testamento === filtroTestamentoAtual;
            });

            if (filtradas.length > 0) {
                acc.push({ ...palavraItem, concordancias: filtradas, ocorrencias: filtradas.length });
            }
            return acc;
        }, []);
    }

    // Filtro por Livro
    if (filtroLivroAtual !== 'todos') {
        resultados = resultados.reduce((acc, palavraItem) => {
            const filtradas = (palavraItem.concordancias || []).filter(con => {
                const nomeLivroRef = extrairNomeLivroDaReferencia(con.referencia);
                const livroCfg = findLivroByIdConfig(filtroLivroAtual);
                return livroCfg && nomeLivroRef.toLowerCase() === livroCfg.nome.toLowerCase();
            });

            if (filtradas.length > 0) {
                acc.push({ ...palavraItem, concordancias: filtradas, ocorrencias: filtradas.length });
            }
            return acc;
        }, []);
    }

    _renderizarResultados(resultados);
}

function _renderizarResultados(lista) {
    const container = document.getElementById('resultados-container');
    if (!container) return;

    container.innerHTML = '';

    if (!lista || lista.length === 0) {
        if (termoBuscaGlobalAtual) {
            container.innerHTML = `<p class="sem-resultados">Nenhum resultado encontrado para "${termoBuscaGlobalAtual}" com os filtros aplicados.</p>`;
        } else if (filtroPalavraAtual) {
            container.innerHTML = `<p class="sem-resultados">Nenhum resultado encontrado para "${filtroPalavraAtual}" com os filtros aplicados.</p>`;
        } else {
             container.innerHTML = `<p class="sem-resultados">Nenhum resultado encontrado para os filtros aplicados.</p>`;
        }
        return;
    }

    lista.forEach(item => {
        const section = document.createElement('div');
        section.className = 'palavra-section';
        section.style = 'background:#2a2a2a;border:1px solid #444;border-radius:8px;margin-bottom:20px;padding:15px;';

        const header = document.createElement('div');
        header.className = 'palavra-header';
        header.style = 'display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #444;padding-bottom:10px;margin-bottom:15px;';

        const titulo = document.createElement('h2');
        titulo.textContent = item.palavra;
        titulo.style = 'color:#4a9eff;font-size:1.8em;font-weight:bold;margin:0;text-transform:uppercase;';
        
        const contador = document.createElement('span');
        contador.textContent = `${item.ocorrencias || 0} ocorrências`;
        contador.style = 'background:#4a9eff;color:white;padding:4px 12px;border-radius:15px;font-size:0.9em;font-weight:bold;';
        
        header.appendChild(titulo);
        header.appendChild(contador);
        section.appendChild(header);

        // Veja também / Fonte
        if (item.fonte) {
            const fonte = document.createElement('div');
            fonte.innerHTML = `<strong style="color:#4a9eff;">Fonte:</strong> ${item.fonte}`;
            fonte.style = 'color:#ccc;font-style:italic;margin-bottom:10px;padding:8px;background:#333;border-radius:4px;';
            section.appendChild(fonte);
        }

        if (item['veja tambem']?.length) {
            const veja = document.createElement('div');
            veja.innerHTML = `<strong style="color:#4a9eff;">Veja também:</strong> ${item['veja tambem'].join(', ')}`;
            veja.style = 'color:#ccc;margin-bottom:15px;padding:8px;background:#333;border-radius:4px;';
            section.appendChild(veja);
        }

        const agrupado = {};
        item.concordancias?.forEach(oc => {
            const livro = extrairNomeLivroDaReferencia(oc.referencia);
            if (!agrupado[livro]) agrupado[livro] = [];
            agrupado[livro].push(oc);
        });

        const ordem = getOrdemDosLivrosConfig();
        const livrosPresentes = Object.keys(agrupado);

        ordem.forEach(livro => {
            if (livrosPresentes.includes(livro)) {
                criarSecaoLivro(section, livro, agrupado[livro], item.palavra);
            }
        });

        livrosPresentes.forEach(livro => {
            if (!ordem.includes(livro)) {
                criarSecaoLivro(section, livro, agrupado[livro], item.palavra);
            }
        });

        container.appendChild(section);
    });

    const inicial = document.getElementById('initial-message');
    if (inicial) inicial.style.display = 'none';
}
function criarSecaoLivro(section, livro, ocorrencias, palavra) {
    const grupo = document.createElement('div');
    grupo.className = 'livro-grupo';
    grupo.style = 'margin-bottom:20px;border:1px solid #555;border-radius:6px;overflow:hidden;';

    const cabecalho = document.createElement('div');
    cabecalho.textContent = `${livro} (${ocorrencias.length} ocorrência${ocorrencias.length > 1 ? 's' : ''})`;
    cabecalho.style = 'background:#1a1a1a;color:#ffdd44;padding:12px 15px;font-weight:bold;font-size:1.1em;border-bottom:1px solid #555;';
    grupo.appendChild(cabecalho);

    ocorrencias.forEach(oc => {
        const div = document.createElement('div');
        div.className = 'ocorrencia';
        div.style = 'padding:12px 15px;border-bottom:1px solid #444;background:#252525;';

        const ref = document.createElement('div');
        ref.textContent = oc.referencia;
        ref.style = 'color:#4a9eff;font-weight:bold;margin-bottom:5px;font-size:0.95em;';
        
        const texto = document.createElement('div');
        texto.innerHTML = destacarPalavra(oc.texto, termoBuscaGlobalAtual || palavra);
        texto.style = 'color:#e0e0e0;line-height:1.6;font-size:0.95em;';

        div.appendChild(ref);
        div.appendChild(texto);
        grupo.appendChild(div);
    });

    section.appendChild(grupo);
}

export async function executarBuscaGlobalConcordancia(termo) {
    termoBuscaGlobalAtual = termo.trim().toLowerCase();
    const resultadosContainer = document.getElementById('resultados-container');
    filtroPalavraAtual = ''; // Reset word filter on global search

    if (!termoBuscaGlobalAtual) {
        if (resultadosContainer) resultadosContainer.innerHTML = '<p class="sem-resultados">Digite um termo para a busca global.</p>';
        dadosCarregadosPorLetraOuBusca = [];
        return;
    }

    if (resultadosContainer) resultadosContainer.innerHTML = '<div class="loader" style="text-align: center; padding: 50px; color: #4a9eff; font-size: 1.2em;">🔍 Buscando em toda a Bíblia...</div>';

    let todosOsResultadosGlobais = [];
    const todasAsLetras = 'abcdefghijklmnopqrstuvwxyz'.split('');

    for (const letra of todasAsLetras) {
        try {
            const response = await fetch(`${CONCORDANCIA_DATA_BASE_PATH_LOCAL}${letra}.json`);
            if (!response.ok) continue;

            const jsonData = await response.json();
            const wordEntries = jsonData[letra.toLowerCase()] || jsonData[letra.toUpperCase()] || [];

            wordEntries.forEach(item => {
                let encontrou = false;
                let ocorrencias = [];

                if (item.palavra?.toLowerCase() === termoBuscaGlobalAtual ||
                    item.palavra?.toLowerCase().includes(termoBuscaGlobalAtual)) {
                    encontrou = true;
                    ocorrencias = item.concordancias || [];
                } else if (item.concordancias) {
                    const regex = new RegExp(`\\b${termoBuscaGlobalAtual.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
                    ocorrencias = item.concordancias.filter(oc => regex.test(oc.texto));
                    if (ocorrencias.length > 0) encontrou = true;
                }

                if (!encontrou && item.fonte?.toLowerCase().includes(termoBuscaGlobalAtual)) {
                    encontrou = true;
                    ocorrencias = item.concordancias || [];
                }

                if (!encontrou && item["veja tambem"]?.some(vt => vt.toLowerCase().includes(termoBuscaGlobalAtual))) {
                    encontrou = true;
                    ocorrencias = item.concordancias || [];
                }

                if (encontrou) {
                    todosOsResultadosGlobais.push({ ...item, concordancias: ocorrencias, ocorrencias: ocorrencias.length });
                }
            });
        } catch (e) {
            console.warn(`[BUSCA] Erro ao carregar ${letra}.json:`, e);
        }
    }

    dadosCarregadosPorLetraOuBusca = todosOsResultadosGlobais;
    _aplicarFiltrosERenderizar();
}