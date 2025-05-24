// --- START OF FILE script/dropdown.js ---
// Lógica centralizada para os menus dropdown da barra de navegação

/**
 * dropdown.js
 * Módulo responsável por gerenciar os menus dropdown da barra de navegação.
 * Implementa funcionalidades de menus suspensos, incluindo:
 * - Downloads de bíblias em PDF
 * - Links para recursos externos
 * - Harpa e hinários
 * - Utilitários e ferramentas
 */

// IIFE (Immediately Invoked Function Expression) para evitar poluição do escopo global
(function() {
    'use strict';

    console.log("[dropdown.js] Script iniciado.");

    // === CONFIGURAÇÃO DE CAMINHOS ===
    /**
     * Caminho base para recursos relativos
     * Importante: paths são relativos ao HTML que carrega este script
     * Por exemplo: se versoes.html está em /html/, usamos '../' para acessar /baixar/
     */
    const basePath = '../';

    // === DADOS DOS MENUS DROPDOWN ===
    /**
     * Lista de bíblias disponíveis para download
     * Cada item contém:
     * - texto: Nome exibido no menu
     * - link: Caminho para o arquivo PDF
     */
    const downloads = [
        { texto: 'A Bíblia Católica', link: `${basePath}baixar/A_Biblia_Catolica.pdf` },
        { texto: 'A Bíblia Sagrada NVT', link: `${basePath}baixar/A_Biblia_Sagrada_NVT.pdf` },
        { texto: 'A Bíblia Viva', link: `${basePath}baixar/A_Biblia_Viva.pdf` },
        { texto: 'A vida completa de Jesus<br>Pr. Juanribe Pagliarin', link: `${basePath}baixar/A_vida_completa_de_Jesus_Pr_Juanribe_Pagliarin.pdf` },
        { texto: 'Bíblia de Genebra<br>(só estudo)', link: `${basePath}baixar/Biblia_Genebra_so_estudo.pdf` },
        { texto: 'Bíblia em ordem<br>cronológica NVI', link: `${basePath}baixar/Biblia_em_ordem_cronologica_NVI.pdf` },
        { texto: 'Bíblia explicada', link: `${basePath}baixar/Biblia_explicada.pdf` },
        { texto: 'Bíblia KJA', link: `${basePath}baixar/Biblia_KJA.pdf` },
        { texto: 'Bíblia Palavra-Chave', link: `${basePath}baixar/Biblia_palavra_chave.pdf` },
        { texto: 'Bíblia Thompson<br>Temas em Cadeia', link: `${basePath}baixar/Biblia_Thompson_temas_em_cadeia.pdf` }
    ];

    /**
     * Lista de recursos de dicionário e concordância
     * (Recursos planejados para implementação futura)
     */
    const dicionario = [
        { texto: 'Dicionário (Em breve)', link: 'https://www.exemplo.com/vine' }, // Exemplo
        { texto: 'Concordância (Em breve)', link: 'https://www.exemplo.com/strong' } // Exemplo
    ];

    /**
     * Lista de recursos de músicas e hinários
     * (Recursos planejados para implementação futura)
     */
    const harpaHinario = [
        { texto: 'Harpa Cristã (Em breve)', link: '#' },
        { texto: 'Cantor Cristão (Em breve)', link: '#' }
    ];

    /**
     * Lista de links úteis e ferramentas auxiliares
     * Inclui recursos externos e páginas internas
     */
    const utilidades = [
        { texto: 'IA Ajudar a estudar a biblia', link: 'https://bible.ai/pt' },
        { texto: 'Posso conhecer a Deus', link: 'https://caniknowgod.com/' },
        { texto: 'Dicionário e Comentário<br> de toda a Bíblia', link: 'https://www.apologeta.com.br' },
        { texto: 'BíbliaOn', link: 'https://www.bibliaon.com/' },
        { texto: 'Cursos', link: `${basePath}html/cursos.html` } // Assume página de cursos existe
    ];

    // === FUNÇÕES DO MENU DROPDOWN ===
    /**
     * Popula uma lista dropdown com itens
     * @param {string} listId - ID do elemento <ul> a ser populado
     * @param {Array<{texto: string, link: string}>} items - Array de itens do menu
     */
    function populateList(listId, items) {
        const listElement = document.getElementById(listId);
        if (!listElement) {
            console.warn(`[dropdown.js] Lista '${listId}' nao encontrada no DOM.`);
            return;
        }
        
        // Limpa a lista antes de popular
        listElement.innerHTML = '';

        // Cria elementos para cada item
        items.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.link;
            a.innerHTML = item.texto;

            // Configuracao para links externos/PDFs
            if (item.link !== '#' && (
                item.link.startsWith('http') || 
                item.link.endsWith('.pdf') || 
                item.link.endsWith('.html')
            )) {
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
            }

            li.appendChild(a);
            listElement.appendChild(li);
        });
    }

    /**
     * Controla a visibilidade dos menus dropdown
     */
    function showList(listId) {
        const listElement = document.getElementById(listId);
        if (listElement) {
            listElement.style.display = 'block';
        }
    }

    function hideList(listId) {
        const listElement = document.getElementById(listId);
        if (listElement) {
            listElement.style.display = 'none';
        }
    }

    /**
     * Configura eventos de interacao para os menus dropdown
     * - Exibicao ao passar o mouse
     * - Ocultacao com delay ao remover o mouse
     * - Persistencia durante hover
     */
    function setupDropdownEvents() {
        const dropdownTriggers = document.querySelectorAll('nav ul li.dropdown > a');
        
        dropdownTriggers.forEach((trigger, index) => {
            const dropdownContainer = trigger.parentElement;
            const listContent = dropdownContainer.querySelector('.dropdown-content');

            if (!listContent) {
                console.warn(`[dropdown.js] Menu #${index+1} sem conteudo.`);
                return;
            }

            if (listContent.id) {
                let hideTimeout;

                // Funcao de exibicao
                const show = () => {
                    clearTimeout(hideTimeout);
                    showList(listContent.id);
                };

                // Funcao de ocultacao com delay
                const startHideTimeout = () => {
                    hideTimeout = setTimeout(() => {
                        const currentContainer = trigger.parentElement;
                        const currentList = document.getElementById(listContent.id);

                        if (!currentContainer.matches(':hover') && 
                            (!currentList || !currentList.matches(':hover'))) {
                            hideList(listContent.id);
                        }
                    }, 250);
                };

                // Configuracao dos listeners
                dropdownContainer.addEventListener('mouseenter', show);
                dropdownContainer.addEventListener('mouseleave', startHideTimeout);
                listContent.addEventListener('mouseenter', show);
                listContent.addEventListener('mouseleave', startHideTimeout);
            }
        });
    }

    // === INICIALIZAÇÃO ===
    /**
     * Configura todos os menus dropdown quando o DOM estiver pronto
     * - Popula as listas com seus respectivos itens
     * - Configura eventos de interação
     */
    document.addEventListener('DOMContentLoaded', () => {
        console.log("[dropdown.js] DOM completamente carregado.");

        // Popula todas as listas de menu
        populateList('baixar-list', downloads);
        populateList('dicionario-list', dicionario);
        populateList('harpa-hinario-list', harpaHinario);
        populateList('utilidades-list', utilidades);

        // Configura interatividade dos menus
        setupDropdownEvents();

        console.log("[dropdown.js] Configuração dos menus dropdown concluída.");
    });

})();