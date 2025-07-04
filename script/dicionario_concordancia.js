/*===============================================================================*/
/*                    SCRIPT DE DICIONÁRIO E CONCORDÂNCIA INTEGRADOS             */
/*===============================================================================*/
/*  Este arquivo contém:                                                         */
/*                    - Integração entre dicionário e concordância               */
/*                    - Navegação entre views e gerenciamento de estado          */
/*                    - Carregamento dinâmico de dados e interface               */
/*===============================================================================*/

import {                                                                                                     // Importa funções do módulo concordancia.js
    onConcordanciaViewReady,
    carregarDadosBaseConcordancia,
    atualizarFiltroTestamento,
    atualizarFiltroLivro,
    executarBuscaGlobalConcordancia,
    atualizarFiltroPalavra                                                                                   // Adicionado para o filtro de palavra
} from './concordancia.js';

import { setupDicionarioView, carregarEDisplayDicionarioPorLetra } from './dicionario.js';                   // Importa funções do módulo dicionario.js

// Este bloco importa a função chave para os dropdowns da concordância
import { initConcordanciaDropdowns } from './dropdown_concordancia.js';                                       // Importa inicialização dos dropdowns

// Este bloco configura toda a funcionalidade quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {                                                         // Adiciona listener para DOM carregado
    const mainContent = document.getElementById('mainContent');                                               // Busca elemento de conteúdo principal
    const inicial = document.getElementById('mensagem-inicial');                                              // Busca elemento de mensagem inicial
    const navConcordancia = document.getElementById('concordancia');                                          // Busca navegação da concordância
    const navDicionario = document.getElementById('dicionario');                                              // Busca navegação do dicionário
    const navSobre = document.getElementById('sobre');                                                        // Busca navegação sobre
    const alfabetoSidebar = document.querySelector('.alfabeto-sidebar');                                     // Busca sidebar do alfabeto
    const TELA_CONCORDANCIA_PATH = 'concordancia.html';                                                      // Define caminho para tela de concordância
    const TELA_DICIONARIO_VIEW_PATH = 'dicionario.html';                                                     // Define caminho para tela de dicionário
    const CONCORDANCIA_DATA_BASE_PATH = '../concordancia/';                                                  // Define caminho base para dados da concordância
    let currentView = null;                                                                                  // Define variável para view atual
    let letraAtivaSidebar = null;                                                                            // Define variável para letra ativa na sidebar

    // Este bloco limpa a navegação ativa removendo a classe 'active' de todos os links
    function clearActiveNav() {                                                                               // Define função para limpar navegação ativa
        document.querySelectorAll('nav .menu-opcoes li a.active').forEach(link => link.classList.remove('active')); // Remove classe active de todos os links
    }

    // Este bloco define a navegação ativa adicionando a classe 'active' ao elemento especificado
    function setActiveNav(navElement) {                                                                       // Define função para definir navegação ativa
        if (navElement) navElement.classList.add('active');                                                   // Adiciona classe active se elemento existir
    }

    // Este bloco ajusta a margem do conteúdo principal baseado na presença da sidebar
    function adjustMainContentMargin() {                                                                      // Define função para ajustar margem do conteúdo
        const alfabetoSidebar = document.querySelector('.alfabeto-sidebar');                                 // Busca sidebar do alfabeto
        const mainContent = document.getElementById('mainContent');                                           // Busca conteúdo principal
        const inicial = document.getElementById('mensagem-inicial');                                          // Busca mensagem inicial

        if (!alfabetoSidebar || !mainContent || !inicial) return;                                             // Interrompe se elementos não existirem

        const sidebarWidth = parseFloat(getComputedStyle(alfabetoSidebar).width) || 60;                      // Obtém largura da sidebar
        let applySidebarMargin = false;                                                                       // Define flag para aplicar margem

        if ((currentView === 'concordance' || currentView === 'dictionary') &&                               // Verifica se view atual é concordância ou dicionário
            alfabetoSidebar.style.display !== 'none' && alfabetoSidebar.style.display !== '') {              // Verifica se sidebar está visível
            applySidebarMargin = true;                                                                        // Define flag como true
        }

        mainContent.style.marginLeft = applySidebarMargin ? `${sidebarWidth}px` : '0';                       // Aplica margem se necessário
        inicial.style.marginLeft = mainContent.style.marginLeft;                                             // Aplica mesma margem na mensagem inicial
    }

    // Este bloco carrega uma view específica de forma assíncrona
    async function loadView(viewPath, targetElement, onLoadedCallback) {                                      // Define função assíncrona para carregar view
        if (!targetElement) {                                                                                 // Verifica se elemento alvo existe
            showInitialState();                                                                               // Mostra estado inicial se não existir
            return;                                                                                           // Interrompe a função
        }

        try {                                                                                                 // Inicia bloco try-catch para tratamento de erros
            if (inicial) inicial.style.display = 'none';                                                      // Oculta mensagem inicial
            targetElement.innerHTML = '<div class="loader-geral">Carregando...</div>';                        // Exibe loader enquanto carrega
            const response = await fetch(viewPath);                                                           // Busca arquivo da view
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} ao carregar ${viewPath}`); // Lança erro se requisição falhar
            const html = await response.text();                                                               // Converte resposta para texto
            targetElement.innerHTML = html;                                                                   // Define HTML no elemento alvo
            if (onLoadedCallback) onLoadedCallback();                                                         // Executa callback se fornecido
        } catch (error) {                                                                                     // Captura erros que possam ocorrer
            console.error("Erro ao carregar view:", error);                                                   // Loga erro no console
            targetElement.innerHTML = `<p class="erro-mensagem">${error.message}</p>`;                        // Exibe mensagem de erro
        }
    }

    // Este bloco busca dados da concordância por letra de forma assíncrona
    async function fetchConcordanciaDataByLetter(letra) {                                                     // Define função assíncrona para buscar dados
        const resultadosContainer = mainContent.querySelector('#resultados-container');                      // Busca container de resultados
        if (resultadosContainer) resultadosContainer.innerHTML = '<div class="loader"></div>';               // Exibe loader se container existir

        try {                                                                                                 // Inicia bloco try-catch para tratamento de erros
            const response = await fetch(`${CONCORDANCIA_DATA_BASE_PATH}${letra.toLowerCase()}.json`);        // Busca arquivo JSON da letra
            if (!response.ok) {                                                                               // Verifica se requisição foi bem-sucedida
                if (response.status === 404) throw new Error(`Arquivo de dados '${letra.toLowerCase()}.json' não encontrado.`); // Lança erro específico para 404
                throw new Error(`HTTP error ${response.status}`);                                             // Lança erro genérico
            }
            const jsonData = await response.json();                                                           // Converte resposta para JSON
            const wordEntries = jsonData[letra.toLowerCase()] || jsonData[letra.toUpperCase()] || [];         // Obtém entradas da letra
            carregarDadosBaseConcordancia(wordEntries);                                                       // Carrega dados base da concordância
        } catch (error) {                                                                                     // Captura erros que possam ocorrer
            if (resultadosContainer) resultadosContainer.innerHTML = `<p class="erro-mensagem">Erro ao carregar dados: ${error.message}</p>`; // Exibe mensagem de erro
            carregarDadosBaseConcordancia([]);                                                                // Carrega array vazio em caso de erro
        }
    }

    // Este bloco configura listeners para os botões de letra na sidebar
    function setupGlobalLetterButtonListeners() {                                                             // Define função para configurar listeners de letras
        if (!alfabetoSidebar) return;                                                                         // Interrompe se sidebar não existir
        const letraBtns = alfabetoSidebar.querySelectorAll('.letra-btn');                                    // Busca todos os botões de letra
        letraBtns.forEach(btn => {                                                                            // Itera sobre cada botão
            btn.addEventListener('click', () => {                                                             // Adiciona listener para clique
                alfabetoSidebar.querySelectorAll('.letra-btn.active').forEach(b => b.classList.remove('active')); // Remove active de todos os botões
                btn.classList.add('active');                                                                  // Adiciona active ao botão clicado
                letraAtivaSidebar = btn.dataset.letra;                                                        // Define letra ativa da sidebar

                if (currentView === 'concordance') {                                                          // Verifica se view atual é concordância
                    const buscaGlobalInputConc = mainContent.querySelector('.filtros-container .search-input'); // Busca campo de busca global
                    if (buscaGlobalInputConc) buscaGlobalInputConc.value = '';                               // Limpa campo de busca global
                    const filtroPalavraInputConc = mainContent.querySelector('#filtro-palavra-input');        // Busca campo de filtro de palavra
                    if (filtroPalavraInputConc) filtroPalavraInputConc.value = '';                           // Limpa campo de filtro de palavra

                    fetchConcordanciaDataByLetter(letraAtivaSidebar);                                         // Busca dados da concordância para letra
                } else if (currentView === 'dictionary') {                                                    // Verifica se view atual é dicionário
                    const buscaDicionarioInput = mainContent.querySelector('#dicionarioSearchInput');        // Busca campo de busca do dicionário
                    if (buscaDicionarioInput) buscaDicionarioInput.value = '';                               // Limpa campo de busca do dicionário
                    carregarEDisplayDicionarioPorLetra(letraAtivaSidebar);                                   // Carrega dicionário para letra
                }

                adjustMainContentMargin();                                                                    // Ajusta margem do conteúdo principal
            });
        });
    }

    // Este bloco configura a view da concordância quando carregada e pronta
    function onConcordanciaViewLoadedAndReady() {                                                            // Define função para configurar view da concordância
        initConcordanciaDropdowns(                                                                           // Inicializa dropdowns da concordância
            (testamentoValue) => { atualizarFiltroTestamento(testamentoValue); },                           // Callback para filtro de testamento
            (livroValue) => { atualizarFiltroLivro(livroValue); }                                            // Callback para filtro de livro
        );
        onConcordanciaViewReady();                                                                           // Executa função de ready da concordância

        const buscaGlobalInput = mainContent.querySelector('.filtros-container .search-input');              // Busca campo de busca global
        const btnConsultar = mainContent.querySelector('.filtros-container .search-btn');                    // Busca botão consultar
        const filtroPalavraInputConc = mainContent.querySelector('#filtro-palavra-input');                   // Busca campo de filtro de palavra

        // Este bloco define o handler para busca global da concordância
        function executarBuscaGlobalConcHandler() {                                                          // Define função para executar busca global
            if (!buscaGlobalInput) return;                                                                   // Interrompe se campo não existir
            const termoBusca = buscaGlobalInput.value.trim();                                                // Obtém termo de busca
            executarBuscaGlobalConcordancia(termoBusca);                                                     // Executa busca global

            if (filtroPalavraInputConc) filtroPalavraInputConc.value = '';                                   // Limpa filtro de palavra ao fazer busca global

            if (termoBusca && alfabetoSidebar) {                                                             // Verifica se há termo de busca e sidebar
                alfabetoSidebar.querySelectorAll('.letra-btn.active').forEach(b => b.classList.remove('active')); // Remove active de todos os botões
                letraAtivaSidebar = null;                                                                    // Limpa letra ativa da sidebar
            }
        }
        if (btnConsultar && buscaGlobalInput) {                                                              // Verifica se botão e campo existem
            btnConsultar.addEventListener('click', executarBuscaGlobalConcHandler);                          // Adiciona listener para clique no botão
            buscaGlobalInput.addEventListener('keyup', (event) => {                                          // Adiciona listener para tecla Enter
                if (event.key === 'Enter') btnConsultar.click();                                             // Executa busca se Enter for pressionado
            });
        }
        
        // Este bloco configura listener para o filtro de palavra
        if (filtroPalavraInputConc) {                                                                        // Verifica se campo de filtro existe
            filtroPalavraInputConc.addEventListener('input', (e) => {                                        // Adiciona listener para input
                atualizarFiltroPalavra(e.target.value);                                                      // Atualiza filtro de palavra
            });
        }

        if (letraAtivaSidebar) {                                                                             // Verifica se há letra ativa na sidebar
            fetchConcordanciaDataByLetter(letraAtivaSidebar);                                                // Busca dados da concordância para letra
            const btnLetraAtiva = alfabetoSidebar.querySelector(`.letra-btn[data-letra="${letraAtivaSidebar}"]`); // Busca botão da letra ativa
            if (btnLetraAtiva && !btnLetraAtiva.classList.contains('active')) {                             // Verifica se botão existe e não está ativo
                btnLetraAtiva.classList.add('active');                                                       // Adiciona classe active ao botão
            }
        } else {                                                                                             // Caso não haja letra ativa
            const resultadosContainer = mainContent.querySelector('#resultados-container');                  // Busca container de resultados
            if (resultadosContainer && !resultadosContainer.hasChildNodes()) {                               // Verifica se container existe e está vazio
                carregarDadosBaseConcordancia([]);                                                            // Carrega dados vazios para mostrar mensagem inicial
            } else if (!resultadosContainer) {                                                               // Verifica se container não existe
                mainContent.innerHTML = "<p class='erro-mensagem'>Erro ao carregar a Concordância.</p>";      // Exibe mensagem de erro
            }
        }
    }

    // Este bloco configura a view do dicionário quando carregada e pronta
    function onDicionarioViewLoadedAndReady() {                                                              // Define função para configurar view do dicionário
        setupDicionarioView(letraAtivaSidebar);                                                              // Configura view do dicionário
        if (letraAtivaSidebar) {                                                                             // Verifica se há letra ativa na sidebar
            const btnLetraAtiva = alfabetoSidebar.querySelector(`.letra-btn[data-letra="${letraAtivaSidebar}"]`); // Busca botão da letra ativa
            if (btnLetraAtiva && !btnLetraAtiva.classList.contains('active')) {                             // Verifica se botão existe e não está ativo
                btnLetraAtiva.classList.add('active');                                                       // Adiciona classe active ao botão
            }
        }
    }

    // Este bloco configura o listener para navegação da concordância
    navConcordancia.addEventListener('click', (e) => {                                                       // Adiciona listener para clique na navegação da concordância
        e.preventDefault();                                                                                  // Previne comportamento padrão do link
        if (currentView === 'concordance') return;                                                           // Interrompe se já estiver na view de concordância
        clearActiveNav();                                                                                    // Limpa navegação ativa
        setActiveNav(navConcordancia);                                                                       // Define concordância como ativa
        currentView = 'concordance';                                                                         // Define view atual como concordância
        if (alfabetoSidebar) alfabetoSidebar.style.display = 'flex';                                         // Mostra sidebar do alfabeto
        adjustMainContentMargin();                                                                           // Ajusta margem do conteúdo
        loadView(TELA_CONCORDANCIA_PATH, mainContent, onConcordanciaViewLoadedAndReady);                    // Carrega view da concordância
    });

    // Este bloco configura o listener para navegação do dicionário
    navDicionario.addEventListener('click', (e) => {                                                         // Adiciona listener para clique na navegação do dicionário
        e.preventDefault();                                                                                  // Previne comportamento padrão do link
        if (currentView === 'dictionary') return;                                                            // Interrompe se já estiver na view do dicionário
        clearActiveNav();                                                                                    // Limpa navegação ativa
        setActiveNav(navDicionario);                                                                         // Define dicionário como ativo
        currentView = 'dictionary';                                                                          // Define view atual como dicionário
        if (alfabetoSidebar) alfabetoSidebar.style.display = 'flex';                                         // Mostra sidebar do alfabeto
        adjustMainContentMargin();                                                                           // Ajusta margem do conteúdo
        loadView(TELA_DICIONARIO_VIEW_PATH, mainContent, onDicionarioViewLoadedAndReady);                   // Carrega view do dicionário
    });

    // Este bloco configura o listener para navegação sobre
    navSobre.addEventListener('click', (e) => {                                                              // Adiciona listener para clique na navegação sobre
        e.preventDefault();                                                                                  // Previne comportamento padrão do link
        if (currentView === 'sobre') return;                                                                 // Interrompe se já estiver na view sobre
        clearActiveNav();                                                                                    // Limpa navegação ativa
        setActiveNav(navSobre);                                                                              // Define sobre como ativo
        currentView = 'sobre';                                                                               // Define view atual como sobre
        if (alfabetoSidebar) alfabetoSidebar.style.display = 'none';                                         // Oculta sidebar do alfabeto
        if (inicial) inicial.style.display = 'none';                                                         // Oculta mensagem inicial
        letraAtivaSidebar = null;                                                                            // Limpa letra ativa da sidebar
        adjustMainContentMargin();                                                                           // Ajusta margem do conteúdo
        mainContent.innerHTML = `<div style="padding: 20px; color: #e0e0e0; text-align:center;"><h2>Sobre</h2><p>Concordância e Dicionário Bíblico.</p></div>`; // Define conteúdo da página sobre
    });

    setupGlobalLetterButtonListeners();                                                                      // Configura listeners dos botões de letra
    showInitialState();                                                                                      // Mostra estado inicial

    // Este bloco ajusta a margem quando a janela é redimensionada
    window.addEventListener('resize', adjustMainContentMargin);                                               // Adiciona listener para redimensionamento da janela
});