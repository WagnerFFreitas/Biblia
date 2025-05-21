// --- START OF FILE script/dropdown.js ---
// Lógica centralizada para os menus dropdown da barra de navegação

(function() { // Use uma IIFE para encapsular o escopo
    'use strict';

    console.log("[dropdown.js] Script iniciado.");

    // --- DADOS PARA OS MENUS (Exceto Versões) ---
    // IMPORTANTE: Defina os caminhos RELATIVOS AO ARQUIVO HTML que carrega este script.
    // Assumindo que versoes.html está em /html/, caminhos para /baixar/ ou /html/ usam '../'
    const basePath = '../'; // Baseado na localização de html/versoes.html

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

    // Array 'versoes' REMOVIDO daqui, pois a lista será gerada a partir do <select> no HTML principal
    // ou preenchida estaticamente no HTML com links para recarregar a página.

    const dicionario = [
        { texto: 'Dicionário (Em breve)', link: 'https://www.exemplo.com/vine' }, // Exemplo
        { texto: 'Concordância (Em breve)', link: 'https://www.exemplo.com/strong' } // Exemplo
    ];

    const harpaHinario = [
        { texto: 'Harpa Cristã (Em breve)', link: '#' },
        { texto: 'Cantor Cristão (Em breve)', link: '#' }
    ];

    const utilidades = [
        { texto: 'IA Ajudar a estudar a biblia', link: 'https://bible.ai/pt' },
        { texto: 'Posso conhecer a Deus', link: 'https://caniknowgod.com/' },
        { texto: 'Dicionário e Comentário<br> de toda a Bíblia', link: 'https://www.apologeta.com.br' },
        { texto: 'BíbliaOn', link: 'https://www.bibliaon.com/' },
        { texto: 'Cursos', link: `${basePath}html/cursos.html` } // Assume página de cursos existe
    ];


    // --- FUNÇÕES DO MENU DROPDOWN ---

    /**
     * Popula uma lista <ul> com itens <li><a> a partir de um array de dados.
     * @param {string} listId O ID do elemento <ul> a ser populado.
     * @param {Array<object>} items Array de objetos, cada um com { texto: string, link: string }.
     */
    function populateList(listId, items) {
        const listElement = document.getElementById(listId);
        if (!listElement) {
            console.warn(`[dropdown.js] Elemento de lista com ID '${listId}' não encontrado no DOM.`);
            return; // Sai se o elemento não existe
        }
        listElement.innerHTML = ''; // Limpa a lista antes de popular

        items.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.link;
            a.innerHTML = item.texto; // Permite HTML como <br>

            // Abrir links externos, PDFs ou páginas HTML específicas em nova aba
            if (item.link !== '#' && (item.link.startsWith('http') || item.link.endsWith('.pdf') || item.link.endsWith('.html'))) {
                 a.target = '_blank';
                 a.rel = 'noopener noreferrer'; // Segurança para target="_blank"
            }

            // Removemos a lógica específica de clique para 'versoes-list' daqui,
            // já que os links agora devem recarregar a página ou serem gerenciados pelo script principal.

            li.appendChild(a);
            listElement.appendChild(li);
        });
        console.log(`[dropdown.js] Lista '${listId}' populada com ${items.length} itens.`);
    }

    /** Mostra um elemento de lista dropdown. */
    function showList(listId) {
        const listElement = document.getElementById(listId);
        if (listElement) {
            listElement.style.display = 'block';
        } else {
             console.warn(`[dropdown.js] Tentativa de mostrar lista inexistente: '${listId}'`);
        }
    }

    /** Esconde um elemento de lista dropdown. */
    function hideList(listId) {
        const listElement = document.getElementById(listId);
        if (listElement) {
            listElement.style.display = 'none';
        } else {
            // Não é um erro grave se tentar esconder algo que já não existe
            // console.warn(`[dropdown.js] Tentativa de esconder lista inexistente: '${listId}'`);
        }
    }

    /** Configura os eventos de hover para todos os menus dropdown. */
    function setupDropdownEvents() {
        const dropdownTriggers = document.querySelectorAll('nav ul li.dropdown > a'); // Seleciona apenas o link que dispara
        console.log(`[dropdown.js] Encontrados ${dropdownTriggers.length} gatilhos .dropdown > a para configurar eventos.`);

        dropdownTriggers.forEach((trigger, index) => {
            const dropdownContainer = trigger.parentElement; // O <li> que contém o link e a lista
            const listContent = dropdownContainer.querySelector('.dropdown-content');

            if (!listContent) {
                console.warn(`[dropdown.js] Dropdown #${index+1} (gatilho: ${trigger.id || trigger.textContent}) não contém um elemento .dropdown-content.`);
                return;
            }
            const listId = listContent.id;

            if (listId) {
                let hideTimeout; // Timer para esconder o menu

                const show = () => {
                    clearTimeout(hideTimeout); // Cancela qualquer timeout pendente para esconder
                    // Opcional: Esconder outros dropdowns abertos antes de mostrar este
                    // document.querySelectorAll('nav ul li .dropdown-content').forEach(otherList => {
                    //     if (otherList.id !== listId) hideList(otherList.id);
                    // });
                    showList(listId); // Mostra a lista atual
                };

                const startHideTimeout = () => {
                     hideTimeout = setTimeout(() => {
                         // Re-seleciona os elementos no momento da verificação
                         const currentDropdownContainer = document.getElementById(trigger.id)?.parentElement || trigger.parentElement;
                         const currentListContent = document.getElementById(listId);

                         // Só esconde se o mouse NÃO estiver sobre o container do dropdown (li)
                         // E NÃO estiver sobre a lista dropdown em si.
                        if (!currentDropdownContainer.matches(':hover') && (!currentListContent || !currentListContent.matches(':hover'))) {
                            hideList(listId);
                        }
                    }, 250); // Atraso em milissegundos antes de esconder (ajuste se necessário)
                };

                // Adiciona listeners ao container principal do dropdown (o <li>)
                dropdownContainer.addEventListener('mouseenter', show);
                dropdownContainer.addEventListener('mouseleave', startHideTimeout);

                // Adiciona listeners à própria lista (<ul>) para mantê-la visível quando o mouse entra nela
                listContent.addEventListener('mouseenter', show); // Cancela o timer de esconder ao entrar na lista
                listContent.addEventListener('mouseleave', startHideTimeout); // Inicia timer para esconder ao sair da lista

                console.log(`[dropdown.js] Eventos configurados para dropdown com lista ID: '${listId}'.`);

            } else {
                console.warn(`[dropdown.js] Elemento .dropdown-content dentro do dropdown associado a '${trigger.id || trigger.textContent}' não possui um ID.`);
            }
        });
    }

    // --- INICIALIZAÇÃO ---
    // Espera o DOM estar completamente carregado antes de executar o código
    document.addEventListener('DOMContentLoaded', () => {
        console.log("[dropdown.js] DOM completamente carregado.");

        // Popula as listas definidas (exceto 'versoes-list' que agora é tratado diferentemente)
        populateList('baixar-list', downloads);
        // A linha abaixo foi REMOVIDA pois a lista de versões agora é estática no HTML ou preenchida pelo script do index/versoes.html
        // populateList('versoes-list', versoes);
        populateList('dicionario-list', dicionario);
        populateList('harpa-hinario-list', harpaHinario);
        populateList('utilidades-list', utilidades);

        // Configura os eventos de mouse para mostrar/esconder os menus
        setupDropdownEvents();

        console.log("[dropdown.js] Configuração dos menus dropdown (exceto Versões) concluída.");
    });

})(); // Fim da IIFE

// --- FIM DO SCRIPT dropdown.js ---