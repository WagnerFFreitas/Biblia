// script/dicionario_concordancia.js
import {
    onConcordanciaViewReady,
    carregarDadosBaseConcordancia,
    atualizarFiltroTestamento,
    atualizarFiltroLivro,
    executarBuscaGlobalConcordancia,
    atualizarFiltroPalavra // Adicionado para o filtro de palavra
} from './concordancia.js';

import { setupDicionarioView, carregarEDisplayDicionarioPorLetra } from './dicionario.js';

// Esta é a importação chave para os dropdowns da concordância
import { initConcordanciaDropdowns } from './dropdown_concordancia.js';

document.addEventListener('DOMContentLoaded', () => {
    const conteudoPrincipal = document.getElementById('conteudoPrincipal');
    const inicial = document.getElementById('mensagem-inicial');
    const navConcordancia = document.getElementById('concordancia');
    const navDicionario = document.getElementById('dicionario');
    const navSobre = document.getElementById('sobre');
    const menuAlfabetico = document.querySelector('.menu-alfabetico');
    const TELA_CONCORDANCIA_PATH = 'concordancia.html';
    const TELA_DICIONARIO_VIEW_PATH = 'dicionario.html';
    const CONCORDANCIA_DATA_BASE_PATH = '../concordancia/';
    let currentView = null;
    let letraAtivaSidebar = null;

    function clearActiveNav() {
        document.querySelectorAll('nav .menu-opcoes li a.active').forEach(link => link.classList.remove('active'));
    }

    function setActiveNav(navElement) {
        if (navElement) navElement.classList.add('active');
    }

    function adjustMainContentMargin() {
        const menuAlfabetico = document.querySelector('.menu-alfabetico');
        const conteudoPrincipal = document.getElementById('conteudoPrincipal');
        const inicial = document.getElementById('mensagem-inicial');

        if (!menuAlfabetico || !conteudoPrincipal || !inicial) return;

        const sidebarWidth = parseFloat(getComputedStyle(menuAlfabetico).width) || 60;
        let applySidebarMargin = false;

        if ((currentView === 'concordance' || currentView === 'dictionary') &&
            menuAlfabetico.style.display !== 'none' && menuAlfabetico.style.display !== '') {
            applySidebarMargin = true;
        }

        conteudoPrincipal.style.marginLeft = applySidebarMargin ? `${sidebarWidth}px` : '0';
        inicial.style.marginLeft = conteudoPrincipal.style.marginLeft;
    }

    function showInitialState() {
        if (inicial) {
            inicial.innerHTML = `
                <h2>Seja bem-vindo!</h2>
                <p>Escolha Concordância ou Dicionário no menu superior.</p>`;
            inicial.style.display = 'block';
        }
        if (conteudoPrincipal) conteudoPrincipal.innerHTML = '';
        if (menuAlfabetico) menuAlfabetico.style.display = 'none';
        clearActiveNav();
        currentView = null;
        letraAtivaSidebar = null;
        adjustMainContentMargin();
    }

    async function loadView(viewPath, targetElement, onLoadedCallback) {
        if (!targetElement) {
            showInitialState();
            return;
        }

        try {
            if (inicial) inicial.style.display = 'none';
            targetElement.innerHTML = '<div class="loader-geral">Carregando...</div>';
            const response = await fetch(viewPath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} ao carregar ${viewPath}`);
            const html = await response.text();
            targetElement.innerHTML = html;
            if (onLoadedCallback) onLoadedCallback();
        } catch (error) {
            console.error("Erro ao carregar view:", error);
            targetElement.innerHTML = `<p class="erro-mensagem">${error.message}</p>`;
        }
    }

    async function fetchConcordanciaDataByLetter(letra) {
        const resultadosContainer = conteudoPrincipal.querySelector('#resultados-container');
        if (resultadosContainer) resultadosContainer.innerHTML = '<div class="loader"></div>';

        try {
            const response = await fetch(`${CONCORDANCIA_DATA_BASE_PATH}${letra.toLowerCase()}.json`);
            if (!response.ok) {
                if (response.status === 404) throw new Error(`Arquivo de dados '${letra.toLowerCase()}.json' não encontrado.`);
                throw new Error(`HTTP error ${response.status}`);
            }
            const jsonData = await response.json();
            const wordEntries = jsonData[letra.toLowerCase()] || jsonData[letra.toUpperCase()] || [];
            carregarDadosBaseConcordancia(wordEntries);
        } catch (error) {
            if (resultadosContainer) resultadosContainer.innerHTML = `<p class="erro-mensagem">Erro ao carregar dados: ${error.message}</p>`;
            carregarDadosBaseConcordancia([]);
        }
    }

    function setupGlobalLetterButtonListeners() {
        if (!menuAlfabetico) return;
        const letraBtns = menuAlfabetico.querySelectorAll('.letra-btn');
        letraBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                menuAlfabetico.querySelectorAll('.letra-btn.active').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                letraAtivaSidebar = btn.dataset.letra;

                if (currentView === 'concordance') {
                    // Limpa os campos de busca ao selecionar uma nova letra
                    const buscaGlobalInputConc = conteudoPrincipal.querySelector('.filtros-container .search-input');
                    if (buscaGlobalInputConc) buscaGlobalInputConc.value = '';
                    const filtroPalavraInputConc = conteudoPrincipal.querySelector('#filtro-palavra-input');
                    if (filtroPalavraInputConc) filtroPalavraInputConc.value = '';

                    fetchConcordanciaDataByLetter(letraAtivaSidebar);
                } else if (currentView === 'dictionary') {
                    const buscaDicionarioInput = conteudoPrincipal.querySelector('#dicionarioSearchInput');
                    if (buscaDicionarioInput) buscaDicionarioInput.value = '';
                    carregarEDisplayDicionarioPorLetra(letraAtivaSidebar);
                }

                adjustMainContentMargin();
            });
        });
    }

    function onConcordanciaViewLoadedAndReady() {
        initConcordanciaDropdowns(
            (testamentoValue) => { atualizarFiltroTestamento(testamentoValue); },
            (livroValue) => { atualizarFiltroLivro(livroValue); }
        );
        onConcordanciaViewReady();

        const buscaGlobalInput = conteudoPrincipal.querySelector('.filtros-container .search-input');
        const btnConsultar = conteudoPrincipal.querySelector('.filtros-container .search-btn');
        const filtroPalavraInputConc = conteudoPrincipal.querySelector('#filtro-palavra-input');

        function executarBuscaGlobalConcHandler() {
            if (!buscaGlobalInput) return;
            const termoBusca = buscaGlobalInput.value.trim();
            executarBuscaGlobalConcordancia(termoBusca);

            // Limpa o filtro de palavra ao fazer busca global
            if (filtroPalavraInputConc) filtroPalavraInputConc.value = '';

            if (termoBusca && menuAlfabetico) {
                menuAlfabetico.querySelectorAll('.letra-btn.active').forEach(b => b.classList.remove('active'));
                letraAtivaSidebar = null;
            }
        }
        if (btnConsultar && buscaGlobalInput) {
            btnConsultar.addEventListener('click', executarBuscaGlobalConcHandler);
            buscaGlobalInput.addEventListener('keyup', (event) => {
                if (event.key === 'Enter') btnConsultar.click();
            });
        }
        
        // Listener para o filtro de palavra, agora integrado
        if (filtroPalavraInputConc) {
            filtroPalavraInputConc.addEventListener('input', (e) => {
                atualizarFiltroPalavra(e.target.value);
            });
        }

        if (letraAtivaSidebar) {
            fetchConcordanciaDataByLetter(letraAtivaSidebar);
            const btnLetraAtiva = menuAlfabetico.querySelector(`.letra-btn[data-letra="${letraAtivaSidebar}"]`);
            if (btnLetraAtiva && !btnLetraAtiva.classList.contains('active')) {
                btnLetraAtiva.classList.add('active');
            }
        } else {
            const resultadosContainer = conteudoPrincipal.querySelector('#resultados-container');
            if (resultadosContainer && !resultadosContainer.hasChildNodes()) {
                carregarDadosBaseConcordancia([]); // Garante que a mensagem inicial seja mostrada
            } else if (!resultadosContainer) {
                conteudoPrincipal.innerHTML = "<p class='erro-mensagem'>Erro ao carregar a Concordância.</p>";
            }
        }
    }

    function onDicionarioViewLoadedAndReady() {
        setupDicionarioView(letraAtivaSidebar);
        if (letraAtivaSidebar) {
            const btnLetraAtiva = menuAlfabetico.querySelector(`.letra-btn[data-letra="${letraAtivaSidebar}"]`);
            if (btnLetraAtiva && !btnLetraAtiva.classList.contains('active')) {
                btnLetraAtiva.classList.add('active');
            }
        }
    }

    navConcordancia.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentView === 'concordance') return;
        clearActiveNav(); setActiveNav(navConcordancia); currentView = 'concordance';
        if (menuAlfabetico) menuAlfabetico.style.display = 'flex';
        adjustMainContentMargin();
        loadView(TELA_CONCORDANCIA_PATH, conteudoPrincipal, onConcordanciaViewLoadedAndReady);
    });

    navDicionario.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentView === 'dictionary') return;
        clearActiveNav(); setActiveNav(navDicionario); currentView = 'dictionary';
        if (menuAlfabetico) menuAlfabetico.style.display = 'flex';
        adjustMainContentMargin();
        loadView(TELA_DICIONARIO_VIEW_PATH, conteudoPrincipal, onDicionarioViewLoadedAndReady);
    });

    navSobre.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentView === 'sobre') return;
        clearActiveNav(); setActiveNav(navSobre); currentView = 'sobre';
        if (menuAlfabetico) menuAlfabetico.style.display = 'none';
        if (inicial) inicial.style.display = 'none';
        letraAtivaSidebar = null;
        adjustMainContentMargin();
        conteudoPrincipal.innerHTML = `<div style="padding: 20px; color: #e0e0e0; text-align:center;"><h2>Sobre</h2><p>Concordância e Dicionário Bíblico.</p></div>`;
    });

    setupGlobalLetterButtonListeners();
    showInitialState();

    // Ajusta a margem quando a janela é redimensionada
    window.addEventListener('resize', adjustMainContentMargin);
});